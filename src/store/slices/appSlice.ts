import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../states";
import type { Content } from "../../types";

const initialState: AppState = {
    content: 'stops',
    isStopDetailOpen: false,
    selectedStop: null,
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
        setMode: (state, action: PayloadAction<'view' | 'mark' | 'edit'>) => {
            state.mode = action.payload;
        },
        updateStopCoordinates: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
            if (state.selectedStop) {
                state.selectedStop.lat = action.payload.lat;
                state.selectedStop.lng = action.payload.lng;
            }
        }
    }
})

export const { 
    openStopDetail, 
    closeStopDetail, 
    setMode, 
    updateStopCoordinates,
    setContent 
} = appSlice.actions;
export default appSlice;