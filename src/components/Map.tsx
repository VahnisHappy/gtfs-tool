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

    // Custom search control
    class SearchControl implements mapboxgl.IControl {
      private container: HTMLDivElement | null = null
      private map?: mapboxgl.Map
      private input?: HTMLInputElement
      private abortController?: AbortController

      onAdd(map: mapboxgl.Map) {
        this.map = map
        this.container = document.createElement('div')
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group search-control'

        this.container.innerHTML = `
          <input type="text" class="search-input" placeholder="Search place..." aria-label="map-search" />
          <button class="search-btn" title="Toggle search" aria-label="Toggle search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 -960 960 960" fill="#000" style="vertical-align:middle;">
              <<path d="M792-120.67 532.67-380q-30 25.33-69.64 39.67Q423.39-326 378.67-326q-108.44 0-183.56-75.17Q120-476.33 120-583.33t75.17-182.17q75.16-75.17 182.5-75.17 107.33 0 182.16 75.17 74.84 75.17 74.84 182.27 0 43.23-14 82.9-14 39.66-40.67 73l260 258.66-48 48Zm-414-272q79.17 0 134.58-55.83Q568-504.33 568-583.33q0-79-55.42-134.84Q457.17-774 378-774q-79.72 0-135.53 55.83-55.8 55.84-55.8 134.84t55.8 134.83q55.81 55.83 135.53 55.83Z"/></svg>
          </button>
        `

        this.input = this.container.querySelector<HTMLInputElement>('.search-input')!
        const btn = this.container.querySelector<HTMLButtonElement>('.search-btn')!

        // Initially hide the input
        if (this.input) this.input.style.display = 'none'

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

        // Toggle behaviour: first click shows input and focuses it; second click hides input.
        // Search executes only when user presses Enter in the input.
        const toggleHandler = (ev: MouseEvent) => {
          ev.stopPropagation()
          if (!this.input) return
          const isHidden = this.input.style.display === 'none' || this.input.style.display === ''
          if (isHidden) {
            this.input.style.display = 'block'
            this.input.focus()
          } else {
            // hide input and cancel any pending request
            this.input.style.display = 'none'
            if (this.abortController) {
              this.abortController.abort()
              this.abortController = undefined
            }
          }
        }

        btn.addEventListener('click', toggleHandler)

        // Enter in input triggers search
        const keyHandler = (ev: KeyboardEvent) => {
          if (ev.key === 'Enter') {
            ev.preventDefault()
            doSearch()
          } else if (ev.key === 'Escape') {
            // Escape hides the input
            if (this.input) this.input.style.display = 'none'
          }
        }
        this.input.addEventListener('keydown', keyHandler)

        return this.container
      }

      onRemove() {
        if (this.abortController) {
          this.abortController.abort()
        }
        if (this.container?.parentNode) {
          this.container.parentNode.removeChild(this.container)
        }
        this.map = undefined
        this.container = null
        this.input = undefined
      }

      getDefaultPosition(): mapboxgl.ControlPosition {
        return 'top-right'
      }

      clearInput() {
        if (this.input) {
          this.input.value = ''
          this.input.style.display = 'none'
        }
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

    mapRef.current.on('move', handleMove)

    return () => {
      if (mapRef.current) {
        mapRef.current.off('move', handleMove)
        mapRef.current.remove()
        mapRef.current = null
      }
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
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

      // Add new marker
      markerRef.current = new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat(newCenter)
        .addTo(mapRef.current)

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
      <style>{`
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
      )}
      
      <div id="map-container" ref={mapContainerRef} />
    </>
  )
}