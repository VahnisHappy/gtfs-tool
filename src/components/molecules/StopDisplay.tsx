import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import StopMarker from "../atoms/StopMarker";
import type mapboxgl from 'mapbox-gl';

export type StopDisplayProps = {
    map: mapboxgl.Map | null;  // Add this
    onClick?: (index: number) => void;
}

export default function StopDisplay({ map, onClick }: StopDisplayProps) {
    const stops = useSelector((state: RootState) => state.stopState.data);
    return <>
     {stops.map((stop, index) => (
        <StopMarker 
            key={index} 
            stop={stop} 
            map={map}  // Pass map here
            onClick={() => onClick?.(index)}
        />
     ))}
    </>
}