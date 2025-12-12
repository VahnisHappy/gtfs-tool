import {useSelector} from "react-redux";
import type {RootState} from "../../store";
import {Layer, Source} from "react-map-gl/mapbox";

export type PathDisplayProps = {
    lineWidth: number
}

export default function PathDisplay({lineWidth}: PathDisplayProps) {
    const routes = useSelector((state: RootState) => state.routeState.data);
    
    console.log('PathDisplay rendering with routes:', routes)
    
    if (!routes || routes.length === 0) {
        console.log('No routes to display')
        return null
    }
    
    return (
        <>
            {routes.map((route, index) => {
                const path = route?.path || [];
                
                console.log(`Route ${index}:`, {
                    id: route.id,
                    stopIndexes: route.stopIndexes,
                    pathLength: path.length,
                    color: route.color
                })
                
                if (path.length < 2) {
                    console.log(`Route ${index} skipped - not enough points`)
                    return null
                }
                
                const geojson = {
                    type: 'Feature' as const,
                    geometry: {
                        type: 'LineString' as const,
                        coordinates: path.map(point => [point.lng, point.lat])
                    },
                    properties: {}
                }
                
                const routeId = typeof route.id === 'object' ? route.id.value : route.id
                
                return (
                    <Source 
                        key={`route-${routeId || index}`}
                        id={`route-source-${routeId || index}`}
                        type='geojson' 
                        data={geojson}
                    >
                        <Layer 
                            id={`route-layer-${routeId || index}`}
                            type='line' 
                            paint={{
                                'line-width': lineWidth,
                                'line-color': route?.color || '#3b82f6',
                                'line-opacity': 0.8
                            }}
                        />
                    </Source>
                )
            })}
        </>
    )
}