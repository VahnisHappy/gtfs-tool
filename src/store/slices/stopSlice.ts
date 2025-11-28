import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { StopState } from "../states";
import type { Stop } from "../../types";

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
        }
    }
})

export default stopSlice