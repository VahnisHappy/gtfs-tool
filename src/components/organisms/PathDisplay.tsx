import { useEffect, useRef } from "react"
import type { RootState } from "../../store"
import { useSelector } from "react-redux"
import type mapboxgl from 'mapbox-gl'

export type PathDisplayProps = {
    map: mapboxgl.Map | null
    linewidth?: number
}

export default function PathDisplay({ map, linewidth = 3 }: PathDisplayProps) {
    const stops = useSelector((state: RootState) => state.stopState.data)
    const routes = useSelector((state: RootState) => state.routeState.data)
    const layersAddedRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        if (!map || !map.isStyleLoaded()) return

        // Clean up old layers and sources
        layersAddedRef.current.forEach(routeId => {
            if (map.getLayer(`route-layer-${routeId}`)) {
                map.removeLayer(`route-layer-${routeId}`)
            }
            if (map.getSource(`route-source-${routeId}`)) {
                map.removeSource(`route-source-${routeId}`)
            }
        })
        layersAddedRef.current.clear()

        // Draw each route
        routes.forEach((route, routeIndex) => {
            const routeId = `route-${routeIndex}`
            
            // Option 1: Use stopIndexes if available
            let coordinates: number[][] = []
            
            if (route.stopIndexes && route.stopIndexes.length >= 2) {
                coordinates = route.stopIndexes
                    .map(index => stops[index])
                    .filter(stop => stop !== undefined)
                    .map(stop => [stop.lng, stop.lat])
            } 
            // Option 2: Use path if available (direct coordinates)
            else if (route.path && route.path.length >= 2) {
                coordinates = route.path.map(point => [point.lng, point.lat])
            }

            if (coordinates.length < 2) return

            // Add source
            map.addSource(`route-source-${routeId}`, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    },
                    properties: {}
                }
            })

            // Add layer
            map.addLayer({
                id: `route-layer-${routeId}`,
                type: 'line',
                source: `route-source-${routeId}`,
                paint: {
                    'line-color': route.color || '#3b82f6',
                    'line-width': linewidth
                }
            })

            layersAddedRef.current.add(routeId)
        })

        // Cleanup on unmount
        return () => {
            layersAddedRef.current.forEach(routeId => {
                if (map.getLayer(`route-layer-${routeId}`)) {
                    map.removeLayer(`route-layer-${routeId}`)
                }
                if (map.getSource(`route-source-${routeId}`)) {
                    map.removeSource(`route-source-${routeId}`)
                }
            })
            layersAddedRef.current.clear()
        }
    }, [map, routes, stops, linewidth])

    return null
}