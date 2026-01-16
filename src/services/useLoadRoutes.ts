import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { routesApi } from './api';
import { RouteActions } from '../store/actions';
import type { Route } from '../types';

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
}

/**
 * Hook to load routes from the backend on app initialization
 */
export function useLoadRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
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
          
          return {
            id: { value: backendRoute.route_id, error: false },
            name: { value: backendRoute.route_short_name, error: false },
            routeType: backendRoute.route_type,
            color,
            stopIndexes: [], // Routes from DB don't have stop associations yet
            path: backendRoute.route_path || [], // Load path from database
            edit: false,
            isNew: false,
          };
        });

        console.log(`Loaded ${routes.length} routes from backend`);
        
        // Load all routes into Redux store
        dispatch(RouteActions.setRoutes(routes));
        
      } catch (error) {
        console.error('Failed to load routes from backend:', error);
        // Don't throw - allow app to work with empty state
      }
    };

    loadRoutes();
  }, [dispatch]);
}
