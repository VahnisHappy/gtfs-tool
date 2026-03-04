import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {TripState} from "../states";
import type {Trip, TripIndex} from "../../types";

const initialState: TripState = {
    data: []
}
const tripSlice = createSlice({
    name: "tripState",
    initialState,
    reducers: {
        addTrip: (state, {payload}: PayloadAction<Trip>) => {
            state.data.push(payload);
        },
        removeTrip: (state, {payload}: PayloadAction<TripIndex>) => {
            state.data = state.data.filter((_, index) => index !== payload);
        },
        setTrips: (state, {payload}: PayloadAction<Trip[]>) => {
            state.data = payload;
        },
        updateTrip: (state, {payload}: PayloadAction<{index: number; trip: Trip}>) => {
            if (payload.index >= 0 && payload.index < state.data.length) {
                state.data[payload.index] = payload.trip;
            }
        },
    }
});

export default tripSlice;