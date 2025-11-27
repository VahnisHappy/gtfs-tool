import { configureStore } from '@reduxjs/toolkit'
import stopSlice from './slices/stopSlice'
import appSlice from './slices/appSlice';
import routeSlice from './slices/routeSlice';

const store = configureStore({
  reducer: {
    appState: appSlice.reducer,
    stopState: stopSlice.reducer,
    routeState: routeSlice.reducer,
  },
})

export default store;
export type RootState = ReturnType<typeof store.getState>;