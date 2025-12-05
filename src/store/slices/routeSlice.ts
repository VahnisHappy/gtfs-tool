import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Point, Route, RouteIndex } from "../../types";
import type { RouteState, StopIndex } from "../states";

const initialState: RouteState = {
    data: []
}

const routeSlice = createSlice({
    name: "routeState",
    initialState,
    reducers: {
        addRoute: (state, {payload}: PayloadAction<Route>) => {
            state.data = [...state.data, payload];
        },
        setRoutes: (state, {payload}: PayloadAction<Route[]>) => {
            state.data = payload;
        },
        addStopToRoute: (state, {payload}: PayloadAction<StopIndex>) => {
            const route = state.data.find(r => r.edit);
            if (!route) return;
            route.stopIndexes = [...(route.stopIndexes || []), payload];
        },
        removeRoute: (state, {payload}: PayloadAction<RouteIndex>) => {
            state.data = state.data.filter((_, i) => i !== payload);
        },
        setPath: (state, {payload}: PayloadAction<Point[]>) => {
            const route = state.data.find(r => r.edit);
            if (!route) return;
            route.path = payload;
        },
        setRouteColor: (state, {payload}: PayloadAction<{ index: number, color: string }>) => {
            state.data = state.data.map((r, idx) => {
                if (idx === payload.index)
                    r.color = payload.color;
                return r;
            })
        }
    }
})

export default routeSlice