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
        }
    }
})

export default stopSlice