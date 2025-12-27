import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { StopState } from "../states";
import type { Stop, StopIndex } from "../../types";

const initialState: StopState = {
    data: []
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
        removeStop: (state, {payload}: PayloadAction<StopIndex>) => {
            state.data = state.data.filter((_, i) => i !== payload);
        },
        removeLastStop: (state) => {
            state.data = state.data.slice(0, -1);
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
        updateStopField: (state, {payload}: PayloadAction<{index: StopIndex, field: keyof Stop, value: any}>) => {
            const stop = state.data[payload.index];
            if (stop) {
                if (payload.field === 'lat' || payload.field === 'lng') {
                    // Handle coordinate fields directly
                    (stop as any)[payload.field] = payload.value;
                } else {
                    // Handle Field<T> type fields
                    (stop as any)[payload.field] = { value: payload.value, error: undefined };
                }
            }
        }
    }
})

export default stopSlice