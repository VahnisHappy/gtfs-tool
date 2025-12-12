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
  const currentRoute = useSelector((state: RootState) => state.routeState.currentRoute)
  
  const handleMark = (point: Point) => {
    dispatch(StopActions.addStop(createStop(point)))
    dispatch(AppActions.setMode('view'))
  }
  
  // Fixed: Use addStopToRoute instead of addStop
  const handleDrawPath = (stop: StopIndex) => {
    dispatch(RouteActions.addStopToRoute(stop))
  }

  const currentEditedRoute = routes.find(route => route.edit)
  
  useEffect(() => {
    if (!currentEditedRoute) {
      console.log('No route being edited')
      return
    }
    
    console.log('Current edited route:', currentEditedRoute)
    console.log('Stop indexes:', currentEditedRoute.stopIndexes)
    
    const points: Point[] = currentEditedRoute.stopIndexes.map(idx => stops[idx])
    console.log('Points for direction:', points)
    
    if (points.length < 2) {
      console.log('Not enough points, clearing path')
      dispatch(RouteActions.setPath([]))
    } else {
      console.log('Fetching directions...')
      direction(points).then(path => {
        console.log('Direction API returned path with', path.length, 'points')
        dispatch(RouteActions.setPath(path))
      }).catch(err => {
        console.error('Direction API error:', err)
      })
    }
  }, [currentEditedRoute?.stopIndexes?.length, stops])

  const stopsGeoJSON = useMemo(() => {
    return stopsToGeoJSONCollection(stops)
  }, [stops])

  const handleMapDisplayClick = useCallback((e: MapMouseEvent) => {
    const target = e.originalEvent.target as HTMLElement
    if (target !== e.target.getCanvas()) return
    const point = e.lngLat as Point

    console.log('Map clicked at:', {
      latitude: point.lat,
      longitude: point.lng,
      mode: mode
    })
    
    if (mode === 'mark') {
      handleMark(point)
      console.log('Added stop')
    }
  }, [mode])

  const handleDisplayStopClick = (index: number) => {
    console.log('Stop clicked:', {
      index,
      mode,
      stop: stops[index],
      currentRoute: currentRoute,
      currentEditedRoute: currentEditedRoute
    })
    
    if (mode === 'draw') {
      if (!currentEditedRoute) {
        console.error('No route being edited! Click "New Route" first.')
        return
      }
      handleDrawPath(index)
    }
  }

  return (
    <div className="w-full h-full" style={{position: `relative`}}>
      <MapDisplay onClick={handleMapDisplayClick} stops={stopsGeoJSON}>
        <StopDisplay onClick={handleDisplayStopClick} />
        <PathDisplay lineWidth={3} />
      </MapDisplay>
    </div>
  )
}