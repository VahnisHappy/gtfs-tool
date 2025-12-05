import { useEffect, useRef } from "react"
import type { RootState } from "../../store"
import { useSelector } from "react-redux"
import type mapboxgl from 'mapbox-gl'

export type PathDisplayProps = {
    map: mapboxgl.Map | null
    linewidth?: number
}

export default function PathDisplay({ map, linewidth = 3 }: PathDisplayProps) {
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

        // Add new routes
        routes.forEach((route, index) => {
            const path = route?.path || []
            const routeId = String(route?.id || `route-${index}`)
            
            if (path.length < 2) return // Need at least 2 points for a line

            const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: path.map(point => [point.lng, point.lat])
                },
                properties: {}
            }

            // Add source
            map.addSource(`route-source-${routeId}`, {
                type: 'geojson',
                data: geojson
            })

            // Add layer
            map.addLayer({
                id: `route-layer-${routeId}`,
                type: 'line',
                source: `route-source-${routeId}`,
                paint: {
                    'line-width': linewidth,
                    'line-color': route?.color || '#000000'
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
    }, [map, routes, linewidth])

    return null // This component doesn't render anything
}