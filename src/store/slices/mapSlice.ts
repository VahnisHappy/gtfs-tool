import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { MapState } from "../states";


const initialState: MapState = {
  accessToken: import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN || '',
  mapStyle: 'mapbox://styles/mapbox/streets-v12',
  location: {
    lat: 13.0287,
    lng: -78.8184,
    zoom: 2
  }
};

const mapSlice = createSlice({
  name: "mapState",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<{ lat: number; lng: number; zoom?: number }>) => {
      state.location = {
        lat: action.payload.lat,
        lng: action.payload.lng,
        zoom: action.payload.zoom ?? state.location.zoom
      };
    },
    setMapStyle: (state, action: PayloadAction<string>) => {
      state.mapStyle = action.payload;
    }
  }
});

export const { setLocation, setMapStyle } = mapSlice.actions;
export default mapSlice;