import mapboxgl from "mapbox-gl"
import type { MapData } from "../../types"
import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback, type ReactNode } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"

export type MapDisplayProps = {
    onClick?: (e: mapboxgl.MapMouseEvent) => void
    data?: MapData
    children?: ReactNode
    stops?: GeoJSON.FeatureCollection
}

export type MapDisplayHandle = {
    getMap: () => mapboxgl.Map | null
}

const MapDisplay = forwardRef<MapDisplayHandle, MapDisplayProps>((props, ref) => {
    const { accessToken, mapStyle } = useSelector((state: RootState) => state.mapState)
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
    const mapInitializedRef = useRef(false)

    useImperativeHandle(ref, () => ({
        getMap: () => mapInstanceRef.current
    }))

    // Initialize map only once
    useEffect(() => {
        if (!mapContainerRef.current || mapInitializedRef.current) return

        mapboxgl.accessToken = accessToken

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: mapStyle,
            center: [-74.5, 40],
            zoom: 2
        })

        map.on('load', () => {
            // Add source for stops
            map.addSource('stops', {
                type: 'geojson',
                data: props.stops || {
                    type: 'FeatureCollection',
                    features: []
                }
            })

            // Add layer for stop markers
            map.addLayer({
                id: 'stops-layer',
                type: 'circle',
                source: 'stops',
                paint: {
                    'circle-radius': 8,
                    'circle-color': '#3b82f6',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            })

            // Optional: Add labels for stops
            map.addLayer({
                id: 'stops-labels',
                type: 'symbol',
                source: 'stops',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-offset': [0, 1.5],
                    'text-anchor': 'top',
                    'text-size': 12
                },
                paint: {
                    'text-color': '#1f2937',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1
                }
            })
        })

        mapInstanceRef.current = map
        mapInitializedRef.current = true

        return () => {
            map.remove()
            mapInstanceRef.current = null
            mapInitializedRef.current = false
        }
    }, []) // Empty dependency array - only run once

    // Handle click events separately
    useEffect(() => {
        const map = mapInstanceRef.current
        const handler = props.onClick
        if (!map || !handler) return

        map.on('click', handler)

        return () => {
            map.off('click', handler)
        }
    }, [props.onClick])

    // Update GeoJSON data when stops change
    useEffect(() => {
        const map = mapInstanceRef.current
        if (!map || !map.isStyleLoaded()) return

        const source = map.getSource('stops') as mapboxgl.GeoJSONSource
        if (source && props.stops) {
            source.setData(props.stops)
        }
    }, [props.stops])

    return (
        <div ref={mapContainerRef} className="w-full h-full relative">
            {props.children}
        </div>
    )
})

MapDisplay.displayName = 'MapDisplay'

export default MapDisplay