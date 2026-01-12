import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { stopsApi } from './api';
import { StopActions } from '../store/actions';
import type { Stop } from '../types';

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    id: string;
    name: string;
    code?: string;
    description?: string;
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

/**
 * Hook to load stops from the backend on app initialization
 */
export function useLoadStops() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadStops = async () => {
      try {
        console.log('Loading stops from backend...');
        const geoJSON = await stopsApi.getAll() as GeoJSONFeatureCollection;
        
        // Convert GeoJSON features to Stop type
        const stops: Stop[] = geoJSON.features.map((feature) => ({
          id: { value: feature.properties.id, error: undefined },
          name: { value: feature.properties.name, error: undefined },
          lat: feature.geometry.coordinates[1], // GeoJSON is [lng, lat]
          lng: feature.geometry.coordinates[0],
          ...(feature.properties.code && {
            code: { value: feature.properties.code, error: undefined }
          }),
          ...(feature.properties.description && {
            description: { value: feature.properties.description, error: undefined }
          }),
        }));

        console.log(`Loaded ${stops.length} stops from backend`);
        
        // Load all stops into Redux store
        dispatch(StopActions.setStops(stops));
        
      } catch (error) {
        console.error('Failed to load stops from backend:', error);
        // Don't throw - allow app to work with empty state
      }
    };

    loadStops();
  }, [dispatch]);
}