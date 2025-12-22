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
            if (action.payload?.mode === 'new') {
                state.mode = 'draw';
            }
        },
        closeRouteDetail: (state) => {
            state.isRouteDetailOpen = false;
            state.mode = 'view';
        },
        openCalcendarDetail: (state, action: PayloadAction<any>) => {
            state.isCalendarDetailOpen = true;
            state.mode = 'edit';
        },
        closeCalendarDetail: (state) => {
            state.isCalendarDetailOpen = false;
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
    openCalcendarDetail,
    closeCalendarDetail
} = appSlice.actions;
export default appSlice;