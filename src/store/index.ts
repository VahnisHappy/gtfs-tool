import { configureStore } from '@reduxjs/toolkit'
import stopSlice from './slices/stopSlice'
import appSlice from './slices/appSlice';
import routeSlice from './slices/routeSlice';
import mapSlice from './slices/mapSlice';
import calendarSlice from './slices/calendarSlice';
import tripSlice from './slices/tripSlice';
import { gtfsApi } from '../services/gtfsApi';
import type { Stop } from '../types';

const store = configureStore({
  reducer: {
    appState: appSlice.reducer,
    stopState: stopSlice.reducer,
    routeState: routeSlice.reducer,
    calendarState: calendarSlice.reducer,
    mapState: mapSlice.reducer,
    tripState: tripSlice.reducer,
    [gtfsApi.reducerPath]: gtfsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gtfsApi.middleware),
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Helper function to convert stops to GeoJSON
const stopsToGeoJSONCollection = (stops: Stop[]): GeoJSON.FeatureCollection => {
    return {
        type: 'FeatureCollection',
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
};

export const selectStopsGeoJSON = (state: RootState): GeoJSON.FeatureCollection => {
    const stops = state.stopState.data
    return stopsToGeoJSONCollection(stops)
}