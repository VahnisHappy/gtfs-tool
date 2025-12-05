import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store"
import { StopActions, AppActions, RouteActions } from "../store/actions";
import { createStop } from "../factory";
import type { Point, StopIndex } from "../types";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import MapDisplay from "./organisms/MapDisplay";
import type { MapDisplayHandle } from "./organisms/MapDisplay";
import SearchLocation from "./molecules/SearchLocation";
import { stopsToGeoJSONCollection } from "../factory";
import StopDisplay from "./molecules/StopDisplay";
import PathDisplay from "./organisms/PathDisplay";

export default function Map() {
  const dispatch = useDispatch()
  const { mode } = useSelector((state: RootState) => state.appState)
  const { accessToken } = useSelector((state: RootState) => state.mapState)
  const stops = useSelector((state: RootState) => state.stopState.data)
  const mapDisplayRef = useRef<MapDisplayHandle>(null)
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)

  const handleMark = useCallback((point: Point) => {
    dispatch(StopActions.addStop(createStop(point))) // Exit mark mode after placing one stop
    dispatch(AppActions.setMode('view')) // or whatever your default mode is
  }, [dispatch])

  const handleDraw = (stop: StopIndex) => dispatch(RouteActions.addStopToRoute(stop))

  
  // Update mapInstance when ref is available
  useEffect(() => {
    const checkMap = () => {
      const map = mapDisplayRef.current?.getMap()
      if (map && !mapInstance) {
        setMapInstance(map)
      }
    }
    
    // Check immediately and after a short delay to ensure map is ready
    checkMap()
    const timer = setTimeout(checkMap, 100)
    
    return () => clearTimeout(timer)
  }, [mapInstance])
  
  // Convert stops to GeoJSON format
  const stopsGeoJSON = useMemo(() => {
    return stopsToGeoJSONCollection(stops)
  }, [stops])

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

  const mapDisplayStopClick = useCallback((index: number) => {
    if (mode === 'draw') handleDraw(index)
  }, [mode, handleDraw])

  return (
    <div className="w-full h-full" style={{position: `relative`}}>
      <MapDisplay 
        ref={mapDisplayRef}
        onClick={mapDisplayMapClick}
        stops={stopsGeoJSON}
      >
        <SearchLocation 
          map={mapInstance}
          accessToken={accessToken}
          position="top-right"
          placeholder="Search for a location"
        />
        <StopDisplay map={mapInstance} onClick={mapDisplayStopClick}/>
        <PathDisplay map={mapInstance} linewidth={3} />
      </MapDisplay>
    </div>
  )
}