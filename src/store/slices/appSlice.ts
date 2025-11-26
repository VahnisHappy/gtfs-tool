import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../states";
import type { Sidebar } from "../../types";

const initialState: AppState = {
    sidebarContent: 'stops'
}

const appSlice = createSlice({
    name: "appState",
    initialState,
    reducers: {
        setSidebarContent: (state, {payload}: PayloadAction<Sidebar>) => {
            state.sidebarContent = payload;
        }
    }
})

export default appSlice