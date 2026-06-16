import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { MapState } from "../states";
import type { ViewState } from "react-map-gl/mapbox";

const VIEWPORT_STORAGE_PREFIX = 'gtfs-map-viewport';

/**
 * Build the localStorage key for a given agency.
 * Falls back to a generic key when no agency is active yet.
 */
function viewportKey(agencyId?: string | null): string {
  return agencyId
    ? `${VIEWPORT_STORAGE_PREFIX}-${agencyId}`
    : VIEWPORT_STORAGE_PREFIX;
}

function loadSavedViewport(agencyId?: string | null): ViewState | undefined {
  try {
    const saved = localStorage.getItem(viewportKey(agencyId));
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return undefined;
}

const initialState: MapState = {
  accessToken: import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN || '',
  mapStyle: 'mapbox://styles/mapbox/light-v11',
  location: { value: "", error: false },
  flyTo: null,
  viewState: loadSavedViewport(localStorage.getItem('activeAgencyId')),
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
    setViewState: (state, { payload }: PayloadAction<{ viewState: ViewState; agencyId?: string | null }>) => {
      state.viewState = payload.viewState;
      try {
        localStorage.setItem(viewportKey(payload.agencyId), JSON.stringify(payload.viewState));
      } catch { /* ignore quota errors */ }
    },
    /**
     * Load a previously saved viewport for a specific agency from localStorage.
     * Called when the user switches projects.
     */
    loadAgencyViewport: (state, { payload }: PayloadAction<string>) => {
      const saved = loadSavedViewport(payload);
      if (saved) {
        state.viewState = saved;
      } else {
        // No saved viewport for this project — clear so the geocode
        // fallback in Map.tsx can kick in
        state.viewState = undefined;
      }
      state.flyTo = null;
    },
    flyToLocation: (state, { payload }: PayloadAction<{ lat: number, lng: number, zoom?: number } | null>) => {
      state.flyTo = payload;
    }
  }
});


export default mapSlice;