import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store"
import { StopActions, AppActions, RouteActions, MapActions } from "../store/actions";
import { addPolygonVertex, setStationPlanPointA, setStationPlanPointB, setMode } from "../store/slices/appSlice";
import { createStop } from "../factory";
import type { Point, StopIndex } from "../types";
import { useCallback, useEffect, useMemo, useRef } from "react";
import MapDisplay from "./organisms/MapDisplay";
import StopDisplay from "./molecules/StopDisplay";
import PathDisplay from "./organisms/PathDisplay";
import PolygonDraw from "./organisms/PolygonDraw";
import PolygonResultsPanel from "./organisms/PolygonResultsPanel";
import StationPlanDisplay from "./organisms/StationPlanDisplay";
import { direction } from "../services/useMapInteractions";
import type { MapMouseEvent } from "react-map-gl/mapbox";

export default function Map() {
  const dispatch = useDispatch()
  const { mode } = useSelector((state: RootState) => state.appState)
  const stops = useSelector((state: RootState) => state.stopState.data)
  const routes = useSelector((state: RootState) => state.routeState.data)
  const currentRoute = useSelector((state: RootState) => state.routeState.currentRoute)
  const { data: agencies, activeAgencyId } = useSelector((state: RootState) => state.agencyState)
  const { accessToken, viewState } = useSelector((state: RootState) => state.mapState)

  const activeAgency = useMemo(() => agencies.find(a => a.id.value === activeAgencyId), [agencies, activeAgencyId]);

  const hasInitializedMapForAgency = useRef<string | null>(null);

  useEffect(() => {
    if (!viewState && stops.length === 0 && activeAgency?.timezone?.value && accessToken) {
      if (hasInitializedMapForAgency.current === activeAgency.id.value) return;

      const timezoneName = activeAgency.timezone.value.split('/').pop()?.replace(/_/g, ' ') || activeAgency.timezone.value;

      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(timezoneName)}.json?access_token=${accessToken}&types=country,region,place`)
        .then(res => res.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            dispatch(MapActions.flyToLocation({ lat, lng, zoom: 6 }));
            hasInitializedMapForAgency.current = activeAgency.id.value;
          }
        })
        .catch(err => console.error("Error fetching timezone location:", err));
    }
  }, [stops.length, activeAgency, accessToken, dispatch, viewState]);

  const handleMark = (point: Point) => {
    // Create empty placeholder stop with only coordinates
    const placeholderStop = createStop(point);
    dispatch(StopActions.addStop(placeholderStop))
    // Store both coordinates and the index of the newly added stop
    dispatch(AppActions.updateStopCoordinates({ lat: point.lat, lng: point.lng, stopIndex: stops.length }))
    dispatch(AppActions.setMode('view'))
  }

  // Fixed: Use addStopToRoute instead of addStop
  const handleDrawPath = (stop: StopIndex) => {
    dispatch(RouteActions.addStopToRoute(stop))
  }

  const currentEditedRoute = routes.find(route => route.edit)

  const stopIndexesSerialized = JSON.stringify(currentEditedRoute?.stopIndexes || []);

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
  }, [stopIndexesSerialized, stops])

  const stopsGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: stops.map(stop => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [stop.lng, stop.lat]
        },
        properties: {
          id: stop.id.value,
          name: stop.name.value
        }
      }))
    };
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
    } else if (mode === 'polygon') {
      dispatch(addPolygonVertex({ lat: point.lat, lng: point.lng }))
    } else if (mode === 'pickA') {
      dispatch(setStationPlanPointA({ lat: point.lat, lng: point.lng }))
      dispatch(setMode('polygon'))
    } else if (mode === 'pickB') {
      dispatch(setStationPlanPointB({ lat: point.lat, lng: point.lng }))
      dispatch(setMode('polygon'))
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

    // Toggle selection when clicking marker
    const currentSelected = stops[index] ? index : null;
    dispatch(StopActions.selectStop(currentSelected));

    // Fly to the selected stop (skip in draw mode to avoid disrupting route building)
    if (currentSelected !== null && mode !== 'draw') {
      const stop = stops[currentSelected];
      dispatch(MapActions.flyToLocation({ lat: stop.lat, lng: stop.lng, zoom: 16 }));
    }

    if (mode === 'draw') {
      if (!currentEditedRoute) {
        console.error('No route being edited! Click "New Route" first.')
        return
      }
      handleDrawPath(index)
    }
  }

  return (
    <div className="w-full h-full" style={{ position: `relative` }}>
      <MapDisplay onClick={handleMapDisplayClick} stops={stopsGeoJSON}>
        <StopDisplay onClick={handleDisplayStopClick} />
        <PathDisplay lineWidth={6} />
        <PolygonDraw />
        <StationPlanDisplay />
      </MapDisplay>
      {/* <PolygonToolbar /> */}
      <PolygonResultsPanel />
    </div>
  )
}