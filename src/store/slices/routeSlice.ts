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
                id: { value: '', error: true },
                name: { value: '', error: true },
                routeType: '' as unknown as number,
                stopIndexes: [],
                path: [],
                color: payload,
                edit: true,
                isNew: true
            };
            state.data = [...state.data, newRoute];
            state.currentRoute = newRoute;
        },
        startEditingRoute: (state, {payload}: PayloadAction<RouteIndex>) => {
            // Close any existing route being edited
            state.data = state.data.map(r => ({...r, edit: false}));
            // Set the selected route to edit mode
            const route = state.data[payload];
            if (route) {
                route.edit = true;
                route.isNew = false;
                state.currentRoute = route;
            }
        },
        addStopToRoute: (state, {payload}: PayloadAction<StopIndex>) => {
            const route = state.data.find(r => r.edit);
            if (!route) return;
            route.stopIndexes = [...route.stopIndexes, payload];
        },
        updateRouteId: (state, {payload}: PayloadAction<string>) => {
            const route = state.data.find(r => r.edit);
            if (route) {
                route.id = { value: payload, error: payload.trim() === '' };
            }
        },
        updateRouteName: (state, {payload}: PayloadAction<string>) => {
            const route = state.data.find(r => r.edit);
            if (route) {
                route.name = { value: payload, error: payload.trim() === '' };
            }
        },
        setRouteColor: (state, {payload}: PayloadAction<string>) => {
            const route = state.data.find(r => r.edit);
            if (route) {
                route.color = payload;
            }
        },
        finishEditingRoute: (state) => {
            const route = state.data.find(r => r.edit);
            if (route) {
                // Validate before finishing
                if (route.name.value.trim() === '' || route.id.value.trim() === '') {
                    return; // Don't finish if invalid
                }
                route.edit = false;
                route.name.error = false;
                route.id.error = false;
            }
            state.currentRoute = null;
        },
        cancelEditingRoute: (state) => {
            const editingRoute = state.data.find(r => r.edit);
            if (editingRoute?.isNew) {
                // Remove the route if it was newly created and never finished
                state.data = state.data.filter(r => !r.edit);
            } else {
                // Just close edit mode for existing routes
                state.data = state.data.map(r => ({...r, edit: false}));
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
        updateRouteType: (state, {payload}: PayloadAction<number>) => {
            const route = state.data.find(r => r.edit);
            if (route) {
                route.routeType = payload;
            }
        },
        setRoutes: (state, {payload}: PayloadAction<Route[]>) => {
            state.data = payload;
        },
        updateRoute: (state, {payload}: PayloadAction<{index: RouteIndex, route: Route}>) => {
            if (payload.index >= 0 && payload.index < state.data.length) {
                state.data[payload.index] = payload.route;
            }
        }
    }
})

export default routeSlice