import type { Bounds, Point } from "../types";
import Directions from '@mapbox/mapbox-sdk/services/directions'
import type { LineString } from 'geojson';

const directions = Directions({ accessToken: import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN || ''})

export async function direction(routes: Point[]): Promise<Point[]> {
    if (routes.length < 2) {
        console.warn('Need at least 2 points for directions');
        return [];
    }

    try {
        const response = await directions.getDirections({
            profile: 'driving',
            waypoints: routes.map((point) => ({ 
                coordinates: [point.lng, point.lat] 
            })),
            geometries: 'geojson',
        }).send();

        console.log('Direction API response:', response.body);

        if (!response.body.routes || response.body.routes.length === 0) {
            console.warn('No routes found');
            return [];
        }

        const route = response.body.routes[0];  // Get first route
        const geometry = route.geometry as LineString;
        
        if (!geometry || !geometry.coordinates || geometry.coordinates.length === 0) {
            console.warn('No coordinates in route geometry');
            return [];
        }

        const path = geometry.coordinates.map(coordinates => ({
            lng: coordinates[0],
            lat: coordinates[1]
        }));

        console.log(`Direction API returned ${path.length} points`);
        return path;
        
    } catch (error) {
        console.error('Direction API error:', error);
        return [];
    }
}