import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapProps {
  latitude: string
  longitude: string
  resetAddress: () => void
}

export default function Map({ latitude, longitude, resetAddress }: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const stationMarkersRef = useRef<mapboxgl.Marker[]>([])
  const searchControlRef = useRef<any>(null)

  const INITIAL_CENTER: [number, number] = [-78.8184, 13.0287]
  const INITIAL_ZOOM = 2

  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const [searchError, setSearchError] = useState<string>('')

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN || ''

    if (!mapContainerRef.current || mapRef.current) return

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center,
      zoom,
      style: 'mapbox://styles/mapbox/streets-v12'
    })

    // Add a GeoJSON source for station markers
    mapRef.current.on('load', () => {
      if (!mapRef.current) return
     
      mapRef.current.addSource('stations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })

      mapRef.current.addLayer({
        id: 'stations-layer',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-radius': 8,
          'circle-color': 'rgba(255, 18, 18, 1)',
        }
      })

    })

    // Custom search control
    class SearchControl implements mapboxgl.IControl {
      private container: HTMLDivElement | null = null
      private map?: mapboxgl.Map
      private input?: HTMLInputElement
      private abortController?: AbortController
      private toggleBtn?: HTMLButtonElement
      private execBtn?: HTMLButtonElement
      private resetBtn?: HTMLButtonElement

      onAdd(map: mapboxgl.Map) {
        this.map = map
        this.container = document.createElement('div')
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group search-control'

        this.container.innerHTML = `
          <input type="text" class="search-input" placeholder="Search place..." aria-label="map-search" />
          <button class="toggle-btn" title="Toggle search" aria-label="Toggle search">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0">
              <path d="M783.52-110.91 529.85-364.59q-29.76 23.05-68.64 36.57-38.88 13.52-83.12 13.52-111.16 0-188.33-77.17-77.17-77.18-77.17-188.33t77.17-188.33q77.17-77.17 188.33-77.17 111.15 0 188.32 77.17 77.18 77.18 77.18 188.33 0 44.48-13.52 83.12-13.53 38.64-36.57 68.16l253.91 254.15-63.89 63.66ZM378.09-405.5q72.84 0 123.67-50.83 50.83-50.82 50.83-123.67t-50.83-123.67q-50.83-50.83-123.67-50.83-72.85 0-123.68 50.83-50.82 50.82-50.82 123.67t50.82 123.67q50.83 50.83 123.68 50.83Z"/>
            </svg>
          </button>
          <button class="exec-btn" title="Search" aria-label="Execute search">Go</button>
          <button class="reset-btn" title="Reset map" aria-label="Reset map">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0">
              <path d="M111.87-263.74v-90.76h569.56v90.76H111.87Zm83.35-170.76v-90.76h569.56v90.76H195.22Zm83.35-170.76v-90.76h569.56v90.76H278.57Z"/>
            </svg>
          </button>
        `
        
        this.input = this.container.querySelector<HTMLInputElement>('.search-input')!
        this.toggleBtn = this.container.querySelector<HTMLButtonElement>('.toggle-btn')!
        this.execBtn = this.container.querySelector<HTMLButtonElement>('.exec-btn')!
        this.resetBtn = this.container.querySelector<HTMLButtonElement>('.reset-btn')!

        // Initially hide the input and exec/reset buttons
        if (this.input) this.input.style.display = 'none'
        if (this.execBtn) this.execBtn.style.display = 'none'
        if (this.resetBtn) this.resetBtn.style.display = 'none'

        const doSearch = async () => {
          const q = this.input!.value.trim()
          if (!q || !this.map) return

          if (this.abortController) {
            this.abortController.abort()
          }
          this.abortController = new AbortController()

          try {
            setSearchError('')
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
              { signal: this.abortController.signal }
            )
            if (!res.ok) throw new Error('Search failed')
            const data = await res.json()
            if (data && data[0]) {
              const lat = parseFloat(data[0].lat)
              const lon = parseFloat(data[0].lon)

              // Log coordinates
              console.log('Search query:', q)
              console.log('Latitude:', lat, 'Longitude:', lon)
              console.log('Coordinates (lon, lat):', [lon, lat])

              this.map!.flyTo({ center: [lon, lat], zoom: 12, essential: true })
            } else {
              setSearchError('Location not found')
              setTimeout(() => setSearchError(''), 3000)
            }
          } catch (e: any) {
            if (e.name !== 'AbortError') {
              console.error('Search error', e)
              setSearchError('Search error occurred')
              setTimeout(() => setSearchError(''), 3000)
            }
          }
        }

        // Toggle input visibility
        const toggleHandler = (ev: MouseEvent) => {
          ev.stopPropagation()
          if (!this.input || !this.execBtn || !this.resetBtn) return
          const isHidden = this.input.style.display === 'none' || this.input.style.display === ''
          if (isHidden) {
            this.input.style.display = 'block'
            this.execBtn.style.display = 'inline-block'
            this.resetBtn.style.display = 'inline-block'
            this.input.focus()
          } else {
            this.input.style.display = 'none'
            this.execBtn.style.display = 'none'
            this.resetBtn.style.display = 'none'
            if (this.abortController) {
              this.abortController.abort()
              this.abortController = undefined
            }
          }
        }

        const execHandler = (ev: MouseEvent) => {
          ev.stopPropagation()
          doSearch()
        }

        const resetHandler = (ev: MouseEvent) => {
          ev.stopPropagation()
          // clear input and hide controls
          if (this.input) {
            this.input.value = ''
            this.input.style.display = 'none'
          }
          if (this.execBtn) this.execBtn.style.display = 'none'
          if (this.resetBtn) this.resetBtn.style.display = 'none'
          if (this.abortController) {
            this.abortController.abort()
            this.abortController = undefined
          }
          // reset map view and remove marker if present (uses closure values)
          if (markerRef.current) {
            markerRef.current.remove()
            markerRef.current = null
          }
          if (this.map) {
            this.map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, essential: true })
          }
          // also call parent resetAddress to clear external address state
          try {
            resetAddress()
          } catch (e) {
            // ignore if not present
          }
        }

        this.toggleBtn.addEventListener('click', toggleHandler)
        this.execBtn.addEventListener('click', execHandler)
        this.resetBtn.addEventListener('click', resetHandler)

        // Enter in input triggers search
        const keyHandler = (ev: KeyboardEvent) => {
          if (ev.key === 'Enter') {
            ev.preventDefault()
            doSearch()
          } else if (ev.key === 'Escape') {
            // Escape hides the input
            if (this.input) {
              this.input.style.display = 'none'
              if (this.execBtn) this.execBtn.style.display = 'none'
              if (this.resetBtn) this.resetBtn.style.display = 'none'
            }
          }
        }
        this.input.addEventListener('keydown', keyHandler)

        return this.container
      }

      onRemove() {
        if (this.abortController) {
          this.abortController.abort()
        }
        if (this.toggleBtn) this.toggleBtn.removeEventListener('click', () => {})
        if (this.execBtn) this.execBtn.removeEventListener('click', () => {})
        if (this.resetBtn) this.resetBtn.removeEventListener('click', () => {})
        if (this.container?.parentNode) {
          this.container.parentNode.removeChild(this.container)
        }
        this.map = undefined
        this.container = null
        this.input = undefined
        this.toggleBtn = undefined
        this.execBtn = undefined
        this.resetBtn = undefined
      }

      getDefaultPosition(): mapboxgl.ControlPosition {
        return 'top-right'
      }

      clearInput() {
        if (this.input) {
          this.input.value = ''
          this.input.style.display = 'none'
        }
        if (this.execBtn) this.execBtn.style.display = 'none'
        if (this.resetBtn) this.resetBtn.style.display = 'none'
      }
    }

    // Add controls
    const navControl = new mapboxgl.NavigationControl()
    const searchControl = new SearchControl()

    mapRef.current.addControl(searchControl, 'top-right')
    searchControlRef.current = searchControl
    mapRef.current.addControl(navControl, 'top-right')

    // Update center and zoom on map movement
    const handleMove = () => {
      if (mapRef.current) {
        const mapCenter = mapRef.current.getCenter()
        const mapZoom = mapRef.current.getZoom()
        setCenter([mapCenter.lng, mapCenter.lat])
        setZoom(mapZoom)
      }
    }

    // Right-click on map to add a station marker (circle style)
    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      if (!mapRef.current) return
      
      // Only handle right-click (context menu)
      if (e.originalEvent.button !== 2) return
      
      // Prevent default context menu
      e.preventDefault()
      
      const lngLat = e.lngLat
      
      // Get current source data
      const source = mapRef.current.getSource('stations') as mapboxgl.GeoJSONSource
      if (!source) return
      
      // Add new feature to the source
      const currentData = (source as any)._data as GeoJSON.FeatureCollection
      const newFeature: GeoJSON.Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lngLat.lng, lngLat.lat]
        },
        properties: {
          id: Date.now(),
          lat: lngLat.lat.toFixed(6),
          lon: lngLat.lng.toFixed(6)
        }
      }
      
      currentData.features.push(newFeature)
      source.setData(currentData)
      
      // Show popup with coordinates
      new mapboxgl.Popup({ offset: 12, closeOnClick: true })
        .setLngLat([lngLat.lng, lngLat.lat])
        .setHTML(
          `<strong>Station</strong><br/>
           Lat: ${lngLat.lat.toFixed(6)}<br/>
           Lon: ${lngLat.lng.toFixed(6)}`
        )
        .addTo(mapRef.current)
      
      console.log('Station placed at:', { lat: lngLat.lat, lon: lngLat.lng })
    }

    // Left-click to show station info if clicking on a station marker
    const handleLeftClick = (e: mapboxgl.MapMouseEvent) => {
      if (!mapRef.current) return
      
      // Only handle left-click
      if (e.originalEvent.button !== 0) return
      
      const lngLat = e.lngLat
      
      // Query rendered features at the click point
      const features = mapRef.current.queryRenderedFeatures(e.point, {
        layers: ['stations-layer']
      })
      
      // If clicked on a station marker, show its info
      if (features.length > 0) {
        const station = features[0]
        const coords = station.geometry.type === 'Point' ? station.geometry.coordinates : [0, 0]
        const props = station.properties || {}
        
        new mapboxgl.Popup({ offset: 12, closeOnClick: true })
          .setLngLat([coords[0], coords[1]])
          .setHTML(
            `<strong>Station Info</strong><br/>
             Lat: ${props.lat || coords[1].toFixed(6)}<br/>
             Lon: ${props.lon || coords[0].toFixed(6)}<br/>
             ID: ${props.id || 'N/A'}`
          )
          .addTo(mapRef.current)
        
        console.log('Station clicked:', props)
      } else {
        // If not clicking on a station, show general location info
        new mapboxgl.Popup({ offset: 12, closeOnClick: true })
          .setLngLat([lngLat.lng, lngLat.lat])
          .setHTML(
            `<strong>Location Info</strong><br/>
             Lat: ${lngLat.lat.toFixed(6)}<br/>
             Lon: ${lngLat.lng.toFixed(6)}<br/>
             <em>Right-click to add station</em>`
          )
          .addTo(mapRef.current)
      }
    }

    mapRef.current.on('move', handleMove)
    mapRef.current.on('contextmenu', handleMapClick) // right-click
    mapRef.current.on('click', handleLeftClick) // left-click
 
    return () => {
      if (mapRef.current) {
        mapRef.current.off('move', handleMove)
        mapRef.current.off('contextmenu', handleMapClick)
        mapRef.current.off('click', handleLeftClick)
        mapRef.current.remove()
        mapRef.current = null
      }
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      // remove any station markers added by clicks
      if (stationMarkersRef.current.length) {
        stationMarkersRef.current.forEach((m) => m.remove())
        stationMarkersRef.current = []
      }
    }
  }, []) 

  // Handle latitude/longitude changes
  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      const lat = parseFloat(latitude)
      const lon = parseFloat(longitude)
      
      if (isNaN(lat) || isNaN(lon)) {
        console.error('Invalid coordinates')
        return
      }

      const newCenter: [number, number] = [lon, lat]
      
      // Remove old marker if exists
      if (markerRef.current) {
        markerRef.current.remove()
      }

      // Fly to new location
      mapRef.current.flyTo({
        center: newCenter,
        zoom: 12,
        essential: true
      })
    }
  }, [latitude, longitude])

  const handleReset = () => {
    setCenter(INITIAL_CENTER)
    setZoom(INITIAL_ZOOM)
    setSearchError('')
    resetAddress()
    
    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
    
    if (searchControlRef.current?.clearInput) {
      searchControlRef.current.clearInput()
    }
    
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        essential: true
      })
    }
  }

  return (
    <>
      {/* <style>{`
        .sidebar {
          background-color: rgba(35, 55, 75, 0.9);
          color: #fff;
          padding: 6px 12px;
          font-family: monospace;
          z-index: 1;
          position: absolute;
          top: 0;
          left: 0;
          margin: 12px;
          border-radius: 4px;
          font-size: 13px;
        }

        .reset-button:hover {
          background: #f0f0f0;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
        }

        .reset-button:active {
          transform: scale(0.98);
        }

        #map-container {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .search-control {
          display: flex;
          gap: 0;
          background: white;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
        }

        .search-input {
          border: none;
          padding: 6px 10px;
          outline: none;
          font-size: 12px;
          width: 180px;
        }

        .search-btn {
          border: none;
          background: white;
          cursor: pointer;
          padding: 6px 10px;
          border-left: 1px solid #ddd;
          transition: background 0.2s;
        }

        .search-btn:hover {
          background: #f5f5f5;
        }

        .error-message {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          background: #ff4444;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          z-index: 1000;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>

      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      
      <button className="reset-button" onClick={handleReset}>
        Reset
      </button>

      {searchError && (
        <div className="error-message">{searchError}</div>
      )} */}
      
      <div id="map-container" ref={mapContainerRef} />
    </>
  )
}