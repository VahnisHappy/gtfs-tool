import {useSelector} from "react-redux";
import type {RootState} from "../../store";
import type {Feature} from "geojson";
import {Layer, Source} from "react-map-gl/mapbox";

export type PathDisplayProps = {
    lineWidth: number
}
type Path = {
    line: Feature,
    color: string
}
export default function PathDisplay({lineWidth}: PathDisplayProps) {
    const routes = useSelector((state: RootState) => state.routeState.data);
    const paths: Path[] = routes.map(route => {
        const path = route?.path || [];
        return {
            line: {
                type: 'Feature',
                geometry: {
                    type: 'LineString', coordinates: path.map(point => [point.lng, point.lat])
                },
                properties: null
            },
            color: route?.color || 'black'
        };
    })
    return paths.map((path, index) => <Source key={index} type='geojson' data={path.line}>
            <Layer type='line' paint={{
                'line-width': lineWidth,
                'line-color': path.color,
            }}/>
        </Source>)
}