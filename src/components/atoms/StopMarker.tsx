import { useState } from "react";
import type { Stop } from "../../types";
import { Marker } from 'react-map-gl/mapbox';
import type { MarkerDragEvent } from 'react-map-gl/mapbox';

export type StopMarkerProps = {
    stop: Stop;
    isSelected?: boolean;
    isDraggable?: boolean;
    onClick?: (stop: Stop) => void;
    onDragEnd?: (lat: number, lng: number) => void;
}

export default function StopMarker({ stop, isSelected = false, isDraggable = false, onClick, onDragEnd }: StopMarkerProps) {
    const [dragCoords, setDragCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = () => {
        setIsDragging(true);
        setDragCoords({ lat: stop.lat, lng: stop.lng });
    };

    const handleDrag = (e: MarkerDragEvent) => {
        setDragCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    };

    const handleDragEnd = (e: MarkerDragEvent) => {
        setIsDragging(false);
        setDragCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        onDragEnd?.(e.lngLat.lat, e.lngLat.lng);
        // Keep overlay visible briefly, then clear
        setTimeout(() => setDragCoords(null), 2000);
    };

    return (
        <>
            <Marker
                longitude={stop.lng}
                latitude={stop.lat}
                draggable={isDraggable}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                onClick={() => onClick?.(stop)}
            >
                <div style={{
                    width: isSelected ? '28px' : '20px',
                    height: isSelected ? '28px' : '20px',
                    backgroundColor: isSelected ? '#2FA6FF' : 'red',
                    borderRadius: '50%',
                    border: isDraggable ? '3px solid white' : 'none',
                    cursor: isDraggable ? 'grab' : 'pointer',
                    boxShadow: isDraggable ? '0 0 8px rgba(47, 166, 255, 0.5)' : 'none',
                    transition: 'all 0.2s ease'
                }} />
            </Marker>

            {/* Coordinate overlay during and after drag */}
            {isDraggable && dragCoords && (
                <Marker
                    longitude={dragCoords.lng}
                    latitude={dragCoords.lat}
                    anchor="bottom"
                    offset={[0, -24]}
                >
                    <div style={{
                        background: isDragging
                            ? 'rgba(0, 0, 0, 0.85)'
                            : 'rgba(47, 166, 255, 0.9)',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        transition: 'background 0.2s ease',
                    }}>
                        <div style={{ fontWeight: 600, marginBottom: '2px', fontSize: '10px', opacity: 0.8 }}>
                            {isDragging ? '📍 Dragging...' : '✓ New position'}
                        </div>
                        <div>Lat: {dragCoords.lat.toFixed(6)}</div>
                        <div>Lng: {dragCoords.lng.toFixed(6)}</div>
                    </div>
                </Marker>
            )}
        </>
    );
}