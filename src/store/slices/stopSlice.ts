import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { StopState } from "../states";
import type { Stop, StopIndex } from "../../types";

const initialState: StopState = {
    data: [],
    selectedIndex: null
}

const stopSlice = createSlice({
    name: "stopState",
    initialState,
    reducers: {
        setStops: (state, {payload}: PayloadAction<Stop[]>) => {
            state.data = payload;
        },
        addStop: (state, {payload}: PayloadAction<Stop>) => {
            state.data = [...state.data, payload];
        },
        removeStop: (state, {payload}: PayloadAction<string>) => {
            state.data = state.data.filter((stop) => stop.id.value !== payload);
            state.selectedIndex = null;
        },
        removeLastStop: (state) => {
            state.data = state.data.slice(0, -1);
            state.selectedIndex = null;
        },
        updateStop: (state, {payload}: PayloadAction<{index: StopIndex, stop: Stop}>) => {
            state.data[payload.index] = payload.stop;
        },
        setCoordinates: (state, {payload}: PayloadAction<{index: StopIndex, lat: number, lng: number}>) => {
            const stop = state.data[payload.index];
            stop.lat = payload.lat;
            stop.lng = payload.lng;
            state.data[payload.index] = stop;
        },
        selectStop: (state, {payload}: PayloadAction<number | null>) => {
            state.selectedIndex = payload;
        }
    }
})

export default stopSlice