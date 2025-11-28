import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../states";
import type { Content } from "../../types";

const initialState: AppState = {
    content: 'stops',
    isStopDetailOpen: false,
    selectedStop: null
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
        },
        closeStopDetail: (state) => {
            state.isStopDetailOpen = false;
            state.selectedStop = null;
        }
        
    }
})

export const { openStopDetail, closeStopDetail } = appSlice.actions;
export default appSlice