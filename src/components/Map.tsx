import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store"
import { StopActions, AppActions, RouteActions } from "../store/actions";
import { createStop } from "../factory";
import type { Point, StopIndex } from "../types";
import { useCallback, useEffect, useMemo } from "react";
import MapDisplay from "./organisms/MapDisplay";
import { stopsToGeoJSONCollection } from "../factory";
import StopDisplay from "./molecules/StopDisplay";
import PathDisplay from "./organisms/PathDisplay";
import { direction } from "../services/useMapInteractions";
import type { MapMouseEvent } from "react-map-gl/mapbox";

export default function Map() {
  const dispatch = useDispatch()
  const { mode } = useSelector((state: RootState) => state.appState)
  const stops = useSelector((state: RootState) => state.stopState.data)
  const routes = useSelector((state: RootState) => state.routeState.data)
  
  const handleMark = (point: Point) => {
    dispatch(StopActions.addStop(createStop(point)))
    // Exit mark mode after placing one stop
    dispatch(AppActions.setMode('view'))
  }
  
  const handleDrawPath = (stop: StopIndex) => dispatch(RouteActions.addStop(stop))
  const currentRoute = useSelector((state: RootState) => state.routeState.currentRoute)

  const currentEditedRoute = routes.find(route => route.edit)
  useEffect(() => {
    if (!currentEditedRoute) return
    const points: Point[] = currentEditedRoute.stopIndexes.map(idx => stops[idx])
    if (points.length < 2) dispatch(RouteActions.setPath([]))
      else direction(points).then(path => {
        dispatch(RouteActions.setPath(path))
      })
  }, [currentEditedRoute?.stopIndexes, stops])

  const stopsGeoJSON = useMemo(() => {
    return stopsToGeoJSONCollection(stops)
  }, [stops])

  const handleMapDisplayClick = useCallback((e: MapMouseEvent) => {
    const target = e.originalEvent.target as HTMLElement
    if (target !== e.target.getCanvas()) return
    const point = e.lngLat as Point

    console.log('Map clicked at:', {
      lat: point.lat,
      lng: point.lng,
      mode: mode
    })
    
    if (mode === 'mark') {
      handleMark(point)
      console.log('Added stop in GeoJSON format')
    }
    console.log('Current stops (GeoJSON):', stopsGeoJSON);
    
  }, [mode, stopsGeoJSON])

  const mapDisplayStopClick = (index: number) => {
    if (mode === 'draw') {
      console.log('Stop clicked:', {
        clickedStopIndex: index,
        clickedStop: stops[index],
        currentRoute: currentRoute,
        currentStops: currentRoute?.stopIndexes
      });
      
      handleDrawPath(index);
    }
  }

  return (
     <div className="w-full h-full" style={{position: `relative`}}>
      <MapDisplay onClick={handleMapDisplayClick} stops={stopsGeoJSON}>
        <StopDisplay onClick={mapDisplayStopClick} />
        <PathDisplay lineWidth={3} />
      </MapDisplay>
     </div>
  )
}