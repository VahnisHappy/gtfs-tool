import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Route } from "../../types";
import type { RouteState } from "../states";

const initialState: RouteState = {
    data: []
}

const routeSlice = createSlice({
    name: "routeState",
    initialState,
    reducers: {
        setRoutes: (state, {payload}: PayloadAction<Route[]>) => {
            state.data = payload;
        }
    }
})

export default routeSlice