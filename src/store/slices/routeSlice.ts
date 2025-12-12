import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Point, Route, RouteIndex, StopIndex } from "../../types";
import type { RouteState } from "../states";

const initialState: RouteState = {
    data: [],
    currentRoute: null
}

const routeSlice = createSlice({
    name: "routeState",
    initialState,
    reducers: {
        addRoute: (state, {payload}: PayloadAction<Route>) => {
            state.data = [...state.data, payload];
        },
        createRoute: (state, {payload}: PayloadAction<string>) => {
            // Close any existing route being edited
            state.data = state.data.map(r => ({...r, edit: false}));
            // Create new route with edit mode
            const newRoute: Route = {
                id: { value: `route-${Date.now()}`, error: false },
                name: { value: '', error: true },
                stopIndexes: [],
                path: [],
                color: payload,
                edit: true
            };
            state.data = [...state.data, newRoute];
            state.currentRoute = newRoute;
        },
        addStopToRoute: (state, {payload}: PayloadAction<StopIndex>) => {
            const route = state.data.find(r => r.edit);
            if (!route) return;
            route.stopIndexes = [...route.stopIndexes, payload];
        },
        updateRouteName: (state, {payload}: PayloadAction<string>) => {
            const route = state.data.find(r => r.edit);
            if (route) {
                route.name = { value: payload, error: payload.trim() === '' };
            }
        },
        updateRouteColor: (state, {payload}: PayloadAction<string>) => {
            const route = state.data.find(r => r.edit);
            if (route) {
                route.color = payload;
            }
        },
        finishEditingRoute: (state) => {
            const route = state.data.find(r => r.edit);
            if (route) {
                // Validate before finishing
                if (route.name.value.trim() === '' || route.stopIndexes.length < 2) {
                    return; // Don't finish if invalid
                }
                route.edit = false;
            }
            state.currentRoute = null;
        },
        cancelEditingRoute: (state) => {
            // Remove the route being edited if it was never finished
            state.data = state.data.filter(r => !r.edit);
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