import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTripsQuery } from './gtfsApi';
import tripSlice from '../store/slices/tripSlice';
import type { Trip, StopTime, Time } from '../types';
import type { RootState } from '../store';

interface BackendTrip {
  trip_id: string;
  route_id: string;
  service_id: string;
  trip_headsign?: string;
  trip_short_name?: string;
  direction_id?: number;
  block_id?: string;
  wheelchair_accessible?: number;
  bikes_allowed?: number;
  cars_allowed?:number;
  stop_times?: Array<{
    stop_sequence: number;
    stop_id: string;
    arrival_time: string;
    departure_time: string;
    stop_headsign?: string;
    pickup_type?: number;
    drop_off_type?: number;
    shape_dist_traveled?: number;
    timepoint?: number;
  }>;
}

// Parse time string to Time object
const parseTimeString = (timeStr: string): Time | null => {
  if (!timeStr) return null;
  const parts = timeStr.split(':').map(Number);
  if (parts.length < 2) return null;
  return {
    hour: parts[0] || 0,
    minute: parts[1] || 0,
    second: parts[2] || 0
  };
};

export function useLoadTrips() {
  const dispatch = useDispatch();
  const { data: tripsData, error, isLoading } = useGetTripsQuery();
  
  // Get routes, calendars, and stops to map IDs to indices
  const routes = useSelector((state: RootState) => state.routeState.data);
  const calendars = useSelector((state: RootState) => state.calendarState.data);
  const stops = useSelector((state: RootState) => state.stopState?.data || []);

  useEffect(() => {
    if (tripsData && routes.length && calendars.length && stops.length) {
      // Create maps for efficient ID to index lookup
      const routeIdToIndex = new Map(routes.map((route, index) => [route.id.value, index]));
      const calendarIdToIndex = new Map(calendars.map((calendar, index) => [calendar.id.value, index]));
      const stopIdToIndex = new Map(stops.map((stop, index) => [stop.id.value, index]));

      // Convert backend format to frontend format
      const convertedTrips: Trip[] = (tripsData as any[]).map((backendTrip: BackendTrip) => {
        // Sort stop_times by stop_sequence to ensure correct order
        const sortedStopTimes = [...(backendTrip.stop_times || [])].sort(
          (a, b) => a.stop_sequence - b.stop_sequence
        );
        
        const stopTimes: StopTime[] = sortedStopTimes.map(st => ({
          arrivalTime: { value: parseTimeString(st.arrival_time) },
          departureTime: { value: parseTimeString(st.departure_time) },
          stopIndex: stopIdToIndex.get(st.stop_id) ?? -1,
          stopId: st.stop_id
        }));

        return {
          id: { value: backendTrip.trip_id },
          route: { value: routeIdToIndex.get(backendTrip.route_id) ?? null },
          calendar: { value: calendarIdToIndex.get(backendTrip.service_id) ?? null },
          stopTimes
        };
      });

      dispatch(tripSlice.actions.setTrips(convertedTrips));
    }
  }, [tripsData, routes, calendars, stops, dispatch]);

  if (error) {
    console.error('Failed to load trips:', error);
  }

  return { isLoading, error };
}