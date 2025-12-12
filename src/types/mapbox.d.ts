declare module '@mapbox/mapbox-sdk/services/directions' {
  import type { LineString, Point as GeoJSONPoint } from 'geojson';

  interface DirectionsConfig {
    accessToken?: string;
  }

  interface Waypoint {
    coordinates: [number, number];
  }

  interface DirectionsRequest {
    profile: 'driving-traffic' | 'driving' | 'walking' | 'cycling';
    waypoints: Waypoint[];
    geometries?: 'geojson' | 'polyline' | 'polyline6';
  }

  interface DirectionsResponse {
    body: {
      routes: Array<{
        geometry: LineString;
        duration: number;
        distance: number;
      }>;
    };
  }

  interface DirectionsService {
    getDirections(request: DirectionsRequest): {
      send(): Promise<DirectionsResponse>;
    };
  }

  function Directions(config?: DirectionsConfig): DirectionsService;
  export default Directions;
}