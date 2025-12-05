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
  const routes = useSelector((state: RootState) => state.routeState.data)
  const currentRoute = useSelector((state: RootState) => state.routeState.currentRoute)
  const mapDisplayRef = useRef<MapDisplayHandle>(null)
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  
  const handleMark = useCallback((point: Point) => {
    dispatch(StopActions.addStop(createStop(point)))
    dispatch(AppActions.setMode('view'))
  }, [dispatch])

  const handleDraw = useCallback((stop: StopIndex) => {
    dispatch(RouteActions.addStopToRoute(stop))
  }, [dispatch])

  // Start a new route when entering draw mode
  useEffect(() => {
    if (mode === 'draw' && !currentRoute) {
      dispatch(RouteActions.startNewRoute())
    }
  }, [mode, currentRoute, dispatch])

  // Log route state for debugging
  useEffect(() => {
    console.log('Current route state:', {
      currentRoute,
      allRoutes: routes,
      routeStops: currentRoute?.stopIndexes?.map(idx => stops[idx])
    })
  }, [currentRoute, routes, stops])
  
  // Update mapInstance when ref is available
  useEffect(() => {
    const checkMap = () => {
      const map = mapDisplayRef.current?.getMap()
      if (map && !mapInstance) {
        setMapInstance(map)
      }
    }
    
    checkMap()
    const timer = setTimeout(checkMap, 100)
    
    return () => clearTimeout(timer)
  }, [mapInstance])
  
  const stopsGeoJSON = useMemo(() => {
    return stopsToGeoJSONCollection(stops)
  }, [stops])

  const mapDisplayMapClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    const target = e.originalEvent.target as HTMLElement;
    if (target !== e.target.getCanvas()) return;
    
    const point: Point = e.lngLat as Point
    
    console.log('Map clicked at:', {
      lat: point.lat,
      lng: point.lng,
      mode: mode
    });
    
    if (mode === 'mark') {
      handleMark(point);
      console.log('Added stop in GeoJSON format');
    }
    
    console.log('Current stops (GeoJSON):', stopsGeoJSON);
  }, [mode, handleMark, stopsGeoJSON])

  const mapDisplayStopClick = useCallback((index: number) => {
    if (mode === 'draw') {
      console.log('Stop clicked:', {
        clickedStopIndex: index,
        clickedStop: stops[index],
        currentRoute: currentRoute,
        currentStops: currentRoute?.stopIndexes
      });
      
      handleDraw(index);
    }
  }, [mode, handleDraw, stops, currentRoute])

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