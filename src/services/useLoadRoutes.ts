import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { routesApi, setApiAgencyId } from './api';
import { RouteActions } from '../store/actions';
import type { Route } from '../types';
import type { RootState } from '../store';

interface BackendRoute {
  route_id: string;
  route_short_name: string;
  route_type: number;
  route_long_name?: string;
  route_desc?: string;
  route_url?: string;
  route_color?: string;
  route_text_color?: string;
  route_sort_order?: number;
  continuous_pickup?: string;
  continuous_drop_off?: string;
  network_id?: string;
  cemv_support?: string;
  route_path?: { lat: number; lng: number }[];
  route_stop_ids?: string[];
}

/**
 * Hook to load routes from the backend on app initialization
 * and reload when activeAgencyId changes
 */
export function useLoadRoutes() {
  const dispatch = useDispatch();
  const stops = useSelector((state: RootState) => state.stopState.data);
  const activeAgencyId = useSelector((state: RootState) => state.agencyState.activeAgencyId);
  const loadedForAgency = useRef<string | null>(null);

  useEffect(() => {
    // Wait until an agency is selected
    if (!activeAgencyId) return;

    // Wait until stops are loaded (routes depend on stops for index mapping)
    // but don't block forever — if there are no stops, that's fine too
    // We check if we've already loaded for this agency to prevent infinite loops
    if (loadedForAgency.current === activeAgencyId) return;

    const loadRoutes = async () => {
      try {
        // Ensure the agency header is set before making the API call
        setApiAgencyId(activeAgencyId);
        console.log('Loading routes from backend for agency:', activeAgencyId);
        const backendRoutes = await routesApi.getAll() as BackendRoute[];

        // Convert backend route format to frontend Route type
        const routes: Route[] = backendRoutes.map((backendRoute) => {
          // Handle color - might already have # or not
          let color = '#3b82f6'; // default
          if (backendRoute.route_color) {
            color = backendRoute.route_color.startsWith('#')
              ? backendRoute.route_color
              : `#${backendRoute.route_color}`;
          }

          // Convert stop IDs back to indices (using current stops state)
          const stopIds = backendRoute.route_stop_ids || [];
          const stopIndexes = stopIds
            .map(stopId => stops.findIndex(s => s.id.value === stopId))
            .filter(idx => idx !== -1);

          return {
            id: { value: backendRoute.route_id, error: false },
            name: { value: backendRoute.route_short_name, error: false },
            routeType: backendRoute.route_type,
            color,
            stopIndexes,
            stopIds,
            path: backendRoute.route_path || [],
            edit: false,
            isNew: false,
          };
        });

        console.log(`Loaded ${routes.length} routes from backend`);

        // Load all routes into Redux store
        dispatch(RouteActions.setRoutes(routes));
        loadedForAgency.current = activeAgencyId;

      } catch (error) {
        console.error('Failed to load routes from backend:', error);
        // Don't throw - allow app to work with empty state
      }
    };

    // Only load routes once stops have loaded (or if there are no stops to load)
    // We use a small delay to let stops settle
    const timer = setTimeout(() => {
      loadRoutes();
    }, stops.length > 0 ? 0 : 500);

    return () => clearTimeout(timer);
  }, [dispatch, stops, activeAgencyId]);
}
