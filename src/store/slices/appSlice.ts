import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../states";
import type { Content } from "../../types";
import type { modes } from "../../data";

const initialState: AppState = {
    content: 'stops',
    isStopDetailOpen: false,
    selectedStop: null,
    isRouteDetailOpen: false,
    selectedRoute: null,
    isCalendarDetailOpen: false,
    selectedCalendar: null,
    isTripDetailOpen: false,
    selectedTrip: null,
    mode: 'view'
}

const appSlice = createSlice({
    name: "appState",
    initialState,
    reducers: {
        setContent: (state, {payload}: PayloadAction<Content>) => {
            state.content = payload;
        },
        openStopDetail: (state, action: PayloadAction<any>) => {
            state.isStopDetailOpen = true;
            state.selectedStop = action.payload || null;
            if (action.payload?.mode === 'new') {
                state.mode = 'mark';
            }
        },
        closeStopDetail: (state) => {
            state.isStopDetailOpen = false;
            state.selectedStop = null;
            state.mode = 'view';
        },
        setMode: (state, action: PayloadAction<typeof modes[number]>) => {
            state.mode = action.payload;
        },
        updateStopCoordinates: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
            if (state.selectedStop) {
                state.selectedStop.lat = action.payload.lat;
                state.selectedStop.lng = action.payload.lng;
            }
        },
        openRouteDetail: (state, action: PayloadAction<any>) => {
            state.isRouteDetailOpen = true;
            state.selectedRoute = action.payload || null;
            if (action.payload?.mode === 'new') {
                state.mode = 'draw';
            }
        },
        closeRouteDetail: (state) => {
            state.isRouteDetailOpen = false;
            state.selectedRoute = null;
            state.mode = 'view';
        },
        openCalendarDetail: (state, action: PayloadAction<any>) => {
            state.isCalendarDetailOpen = true;
            state.selectedCalendar = action.payload || null;
            state.mode = 'edit';
        },
        closeCalendarDetail: (state) => {
            state.isCalendarDetailOpen = false;
            state.selectedCalendar = null;
            state.mode = 'view';
        },
        openTripDetail: (state, action: PayloadAction<any>) => {
            state.isTripDetailOpen = true;
            state.selectedTrip = action.payload || null;
            state.mode = 'edit';
        },
        closeTripDetail: (state) => {
            state.isTripDetailOpen = false;
            state.selectedTrip = null;
            state.mode = 'view';
        }
    }
})

export const { 
    openStopDetail, 
    closeStopDetail, 
    setMode, 
    updateStopCoordinates,
    setContent,
    openRouteDetail,
    closeRouteDetail,
    openCalendarDetail,
    closeCalendarDetail,
    openTripDetail,
    closeTripDetail
} = appSlice.actions;
export default appSlice;