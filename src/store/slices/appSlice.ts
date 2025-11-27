import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../states";
import type { Content } from "../../types";

const initialState: AppState = {
    content: 'stops'
}

const appSlice = createSlice({
    name: "appState",
    initialState,
    reducers: {
        setContent: (state, {payload}: PayloadAction<Content>) => {
            state.content = payload;
        }
    }
})

export default appSlice