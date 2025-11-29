import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store"
import { StopActions } from "../store/actions";
import { createStop } from "../factory";
import type { Point } from "../types";
import { useCallback, useRef } from "react";
import MapDisplay from "./organisms/MapDisplay";
import type { MapDisplayHandle } from "./organisms/MapDisplay";
import { updateStopCoordinates } from "../store/slices/appSlice";

export default function Map() {
  const dispatch = useDispatch()
  const { mode } = useSelector((state: RootState) => state.appState)
  const stops = useSelector((state: RootState) => state.stopState.data)
  const mapDisplayRef = useRef<MapDisplayHandle>(null)

  const mapDisplayMapClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    // Check if clicked directly on canvas (not on a marker or control)
    const target = e.originalEvent.target as HTMLElement;
    if (target !== e.target.getCanvas()) return;
    
    // Get the exact coordinates where clicked
    const point: Point = e.lngLat as Point
    
    console.log('Map clicked at:', {
      lat: point.lat,
      lng: point.lng,
      mode: mode
    });
    
    // When in mark mode, update the coordinates and add visual marker
    if (mode === 'mark') {
      // Update coordinates in Redux
      dispatch(updateStopCoordinates({
        lat: point.lat,
        lng: point.lng
      }));
      
      // Add visual marker on map at exact click location
      if (mapDisplayRef.current) {
        // Use timestamp as unique ID for each marker
        const markerId = `stop-${Date.now()}`
        mapDisplayRef.current.addMarker(point.lat, point.lng, markerId);
      }
      
      console.log('Marker added at:', { 
        lat: point.lat.toFixed(6), 
        lng: point.lng.toFixed(6) 
      });
    }
  }, [mode, dispatch])

  return (
    <div className="w-full h-full relative">
      <MapDisplay 
        ref={mapDisplayRef}
        onClick={mapDisplayMapClick}
      >
        {/* You can add markers or other map elements here as children */}
      </MapDisplay>
    </div>
  )
}