import { useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { useSelector } from "react-redux"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { RootState } from "../../store"
import type { MapData } from "../../types"

export type MapDisplayProps = {
    onClick?: (event: mapboxgl.MapMouseEvent) => void,
    data?: MapData,
    children?: React.ReactNode
}

export interface MapDisplayHandle {
    addMarker: (lat: number, lng: number, id?: string) => void;
    removeMarker: (id: string) => void;
    clearAllMarkers: () => void;
}

const MapDisplay = forwardRef<MapDisplayHandle, MapDisplayProps>((props, ref) => {
    const { accessToken, mapStyle, location } = useSelector((state: RootState) => state.mapState)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const clickHandlerRef = useRef(props.onClick)
    const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())

    // Update click handler ref when it changes
    useEffect(() => {
        clickHandlerRef.current = props.onClick
    }, [props.onClick])

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        addMarker: (lat: number, lng: number, id?: string) => {
            if (!mapRef.current) return

            const markerId = id || `marker-${Date.now()}`

            // Create marker element
            const el = document.createElement('div')
            el.className = 'custom-marker'
            el.style.width = '16px'
            el.style.height = '16px'
            el.style.borderRadius = '50%'
            el.style.backgroundColor = 'rgba(255, 18, 18, 1)'
            el.style.border = '3px solid white'
            el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)'
            el.style.cursor = 'pointer'
            el.style.transition = 'all 0.2s'

            // Add hover effect
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'scale(1.3)'
            })
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'scale(1)'
            })

            // Create and add marker at the exact coordinates
            const marker = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .addTo(mapRef.current)

            // Store marker reference
            markersRef.current.set(markerId, marker)

            console.log(`Marker added at [${lng}, ${lat}]`)
        },
        removeMarker: (id: string) => {
            const marker = markersRef.current.get(id)
            if (marker) {
                marker.remove()
                markersRef.current.delete(id)
            }
        },
        clearAllMarkers: () => {
            markersRef.current.forEach(marker => marker.remove())
            markersRef.current.clear()
        }
    }))

    // Initialize map ONCE
    useEffect(() => {
        // Set access token
        mapboxgl.accessToken = accessToken || ''

        // Don't initialize if already initialized or no container
        if (!mapContainerRef.current || mapRef.current) return

        // Initialize map
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: mapStyle || 'mapbox://styles/mapbox/streets-v12',
            center: location ? [location.lng, location.lat] : [0, 0],
            zoom: location?.zoom || 2
        })

        // Wait for map to load before adding interactions
        mapRef.current.on('load', () => {
            console.log('Map loaded successfully')
        })

        // Add click handler that uses the ref
        const handleClick = (e: mapboxgl.MapMouseEvent) => {
            if (clickHandlerRef.current) {
                clickHandlerRef.current(e)
            }
        }

        mapRef.current.on('click', handleClick)

        // Cleanup only when component unmounts
        return () => {
            if (mapRef.current) {
                mapRef.current.off('click', handleClick)
                mapRef.current.remove()
                mapRef.current = null
            }
            // Clear all markers
            markersRef.current.forEach(marker => marker.remove())
            markersRef.current.clear()
        }
    }, [])

    // Handle map style changes WITHOUT reinitializing
    useEffect(() => {
        if (mapRef.current && mapStyle) {
            mapRef.current.setStyle(mapStyle)
        }
    }, [mapStyle])

    // Handle location changes WITHOUT reinitializing
    useEffect(() => {
        if (mapRef.current && location) {
            mapRef.current.flyTo({
                center: [location.lng, location.lat],
                zoom: location.zoom || mapRef.current.getZoom(),
                essential: true
            })
        }
    }, [location?.lat, location?.lng, location?.zoom])

    // Handle window resize to adjust map
    useEffect(() => {
        const handleResize = () => {
            if (mapRef.current) {
                mapRef.current.resize()
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div 
            ref={mapContainerRef} 
            className="w-full h-full"
            style={{ position: 'relative' }}
        >
            {props.children}
        </div>
    )
})

MapDisplay.displayName = 'MapDisplay'

export default MapDisplay