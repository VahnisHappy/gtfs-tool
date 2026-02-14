import type { Stop } from "../../types";
import { Marker } from 'react-map-gl/mapbox';

export type StopMarkerProps = {
    stop: Stop;
    isSelected?: boolean;
    onClick?: (stop: Stop) => void;
}

export default function StopMarker({ stop, isSelected = false, onClick }: StopMarkerProps) {
    return <Marker longitude={stop.lng} latitude={stop.lat} onClick={() => onClick?.(stop)}>
        <div style={{ 
            width: isSelected ? '26px' : '20px', 
            height: isSelected ? '26px' : '20px', 
            backgroundColor: isSelected ? '#2563eb' : 'red', 
            borderRadius: '50%', 
            border: isSelected ? '3px solid white' : '2px solid white',
            cursor: 'pointer',
            boxShadow: isSelected ? '0 0 10px rgba(37, 99, 235, 0.6)' : 'none',
            transition: 'all 0.2s ease'
         }} />
    </Marker>
}