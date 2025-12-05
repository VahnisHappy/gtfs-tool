import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Stop } from "../../types";

export type StopMarkerProps = {
    stop: Stop;
    map: mapboxgl.Map | null;
    onClick?: (stop: Stop) => void;
}

export default function StopMarker({ stop, map, onClick }: StopMarkerProps) {
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const markerElRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!map || !markerElRef.current) return;

        // Create marker with custom HTML element
        const marker = new mapboxgl.Marker(markerElRef.current)
            .setLngLat([stop.lng, stop.lat])
            .addTo(map);

        markerRef.current = marker;

        return () => {
            marker.remove();
        };
    }, [map, stop.lng, stop.lat]);

    return (
        <div
            ref={markerElRef}
            onClick={() => onClick?.(stop)}
            className="cursor-pointer"
        >
            <div className="w-5 h-5 bg-blue-500 rounded-full shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                {typeof stop.name === 'string' ? stop.name[0] : '•'}
                </span>
            </div>
        </div>
    );
}