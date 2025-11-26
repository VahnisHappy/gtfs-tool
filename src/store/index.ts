import { configureStore } from '@reduxjs/toolkit'
import stopSlice from './slices/stopSlice'
import appSlice from './slices/appSlice';

const store = configureStore({
  reducer: {
    appState: appSlice.reducer,
    stopState: stopSlice.reducer,
  },
})

export default store;
export type RootState = ReturnType<typeof store.getState>;