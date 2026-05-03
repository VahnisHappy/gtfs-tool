import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { MapState } from "../states";
import type { ViewState } from "react-map-gl/mapbox";

const VIEWPORT_STORAGE_KEY = 'gtfs-map-viewport';

function loadSavedViewport(): ViewState | undefined {
  try {
    const saved = localStorage.getItem(VIEWPORT_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return undefined;
}

const initialState: MapState = {
  accessToken: import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN || '',
  mapStyle: 'mapbox://styles/mapbox/streets-v12',
  location: { value: "", error: false },
  flyTo: null,
  viewState: loadSavedViewport(),
};

const mapSlice = createSlice({
  name: "mapState",
  initialState,
  reducers: {
    setLocation: (state, { payload }: PayloadAction<string>) => {
      state.location = { value: payload, error: state.location.error && payload === state.location.value }
    },
    setMapStyle: (state, action: PayloadAction<string>) => {
      state.mapStyle = action.payload;
    },
    setBound: (state, { payload }: PayloadAction<MapState['bounds']>) => {
      if (!payload)
        state.location.error = true;
      else
        state.bounds = payload;
    },
    setViewState: (state, { payload }: PayloadAction<ViewState>) => {
      state.viewState = payload;
      try {
        localStorage.setItem(VIEWPORT_STORAGE_KEY, JSON.stringify(payload));
      } catch { /* ignore quota errors */ }
    },
    flyToLocation: (state, { payload }: PayloadAction<{ lat: number, lng: number, zoom?: number } | null>) => {
      state.flyTo = payload;
    }
  }
});


export default mapSlice;