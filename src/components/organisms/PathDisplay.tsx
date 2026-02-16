import {useSelector} from "react-redux";
import type {RootState} from "../../store";
import {Layer, Source} from "react-map-gl/mapbox";

export type PathDisplayProps = {
    lineWidth: number
}

export default function PathDisplay({lineWidth}: PathDisplayProps) {
    const routes = useSelector((state: RootState) => state.routeState.data);
    
    if (!routes || routes.length === 0) {
        return null
    }
    
    return (
        <>
            {routes.map((route, index) => {
                const path = route?.path || [];
                
                if (path.length < 2) {
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
                
                // Use stable index-based key to prevent remounting
                const stableKey = `route-${index}`;
                
                return (
                    <Source 
                        key={stableKey}
                        id={`route-source-${index}`}
                        type='geojson' 
                        data={geojson}
                    >
                        <Layer 
                            id={`route-layer-${index}`}
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