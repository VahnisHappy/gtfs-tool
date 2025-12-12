import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { MapState } from "../states";
import type { ViewState } from "react-map-gl/mapbox";

const initialState: MapState = {
  accessToken: import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN || '',
  mapStyle: 'mapbox://styles/mapbox/streets-v12',
  location: {value: "", error: false},
};

const mapSlice = createSlice({
  name: "mapState",
  initialState,
  reducers: {
    setLocation: (state, {payload}: PayloadAction<string>) => {
      state.location = {value: payload, error: state.location.error && payload === state.location.value}
    },
    setMapStyle: (state, action: PayloadAction<string>) => {
      state.mapStyle = action.payload;
    },
    setBound: (state, {payload}: PayloadAction<MapState['bounds']>) => {
      if (!payload)
                state.location.error = true;
            else
                state.bounds = payload;
    },
    setViewState: (state, {payload}: PayloadAction<ViewState>) => {
            state.viewState = payload;
    }
  }
});


export default mapSlice;