import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { routesApi } from './api';
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
 */
export function useLoadRoutes() {
  const dispatch = useDispatch();
  const stops = useSelector((state: RootState) => state.stopState.data);
  const hasLoadedRoutes = useRef(false);

  useEffect(() => {
    // Only load routes once
    if (hasLoadedRoutes.current) return;

    const loadRoutes = async () => {
      try {
        console.log('Loading routes from backend...');
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
        hasLoadedRoutes.current = true;
        
        // Load all routes into Redux store
        dispatch(RouteActions.setRoutes(routes));
        
      } catch (error) {
        console.error('Failed to load routes from backend:', error);
        // Don't throw - allow app to work with empty state
      }
    };

    // Load routes after a small delay to ensure stops are loaded first
    const timer = setTimeout(() => {
      loadRoutes();
    }, 100);

    return () => clearTimeout(timer);
  }, [dispatch, stops]);
}
