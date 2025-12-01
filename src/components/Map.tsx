import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store"
import { StopActions } from "../store/actions";
import { createStop } from "../factory";
import type { Point } from "../types";
import { useRef, useMemo, useCallback } from "react";
import MapDisplay from "./organisms/MapDisplay";
import type { MapDisplayHandle } from "./organisms/MapDisplay";
import { stopsToGeoJSONCollection } from "../factory";

export default function Map() {
  const dispatch = useDispatch()
  const { mode } = useSelector((state: RootState) => state.appState)
  const stops = useSelector((state: RootState) => state.stopState.data)
  const mapDisplayRef = useRef<MapDisplayHandle>(null)
  
  // Convert stops to GeoJSON format
  const stopsGeoJSON = useMemo(() => {
    return stopsToGeoJSONCollection(stops)
  }, [stops])
  
  const handleMark = useCallback((point: Point) => {
    dispatch(StopActions.addStop(createStop(point)))
  }, [dispatch])

  // Use useCallback to memoize the click handler
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
    
    // When in mark mode, add the stop
    if (mode === 'mark') {
      handleMark(point);
      console.log('Added stop in GeoJSON format');
    }
    
    console.log('Current stops (GeoJSON):', stopsGeoJSON);
  }, [mode, handleMark, stopsGeoJSON])

  return (
    <div className="w-full h-full" style={{position: `relative`}}>
      <MapDisplay 
        ref={mapDisplayRef}
        onClick={mapDisplayMapClick}
        stops={stopsGeoJSON}
      >
      </MapDisplay>
    </div>
  )
}