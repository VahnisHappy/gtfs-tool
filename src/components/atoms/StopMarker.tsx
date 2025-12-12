import type { Stop } from "../../types";
import { Marker } from 'react-map-gl/mapbox';

export type StopMarkerProps = {
    stop: Stop;
    onClick?: (stop: Stop) => void;
}

export default function StopMarker({ stop, onClick }: StopMarkerProps) {
    return <Marker longitude={stop.lng} latitude={stop.lat} onClick={() => onClick?.(stop)}>
        <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: 'red', 
            borderRadius: '50%', 
            border: '2px solid white',
            cursor: 'pointer'
         }} />
    </Marker>
}