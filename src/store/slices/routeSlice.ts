import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Point, Route, RouteIndex, StopIndex } from "../../types";
import type { RouteState } from "../states";

const initialState: RouteState = {
    data: [],
    currentRoute: null // Add this
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
        startNewRoute: (state) => {
            // Create a new route and set it as current
            const newRoute: Route = {
                id: { value: `route-${Date.now()}` },
                name: { value: '' },
                stopIndexes: [],
                path: [],
                color: '#3b82f6',
                edit: true
            };
            state.data = [...state.data, newRoute];
            state.currentRoute = newRoute;
        },
        addStopToRoute: (state, {payload}: PayloadAction<StopIndex>) => {
            const route = state.data.find(r => r.edit);
            if (!route) {
                console.warn('No route in edit mode found');
                return;
            }
            route.stopIndexes = [...(route.stopIndexes || []), payload];
            // Update currentRoute reference
            state.currentRoute = route;
        },
        finishEditingRoute: (state) => {
            const route = state.data.find(r => r.edit);
            if (route) {
                route.edit = false;
            }
            state.currentRoute = null;
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