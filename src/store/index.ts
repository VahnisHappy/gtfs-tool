import { configureStore } from '@reduxjs/toolkit'
import stopSlice from './slices/stopSlice'
import appSlice from './slices/appSlice';
import routeSlice from './slices/routeSlice';
import mapSlice from './slices/mapSlice';
import { stopsToGeoJSONCollection } from '../factory';

const store = configureStore({
  reducer: {
    appState: appSlice.reducer,
    stopState: stopSlice.reducer,
    routeState: routeSlice.reducer,
    mapState: mapSlice.reducer,
  },
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const selectStopsGeoJSON = (state: RootState): GeoJSON.FeatureCollection => {
    const stops = state.stopState.data
    return stopsToGeoJSONCollection(stops)
}