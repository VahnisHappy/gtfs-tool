import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Agency } from "../../types";

export type AgencyState = {
    data: Agency[],
    activeAgencyId: string | null,
}

const initialState: AgencyState = {
    data: [],
    activeAgencyId: null,
}

const agencySlice = createSlice({
    name: "agencyState",
    initialState,
    reducers: {
        addAgency: (state, action: PayloadAction<Agency>) => {
            state.data.push(action.payload);
            // Set as active if it's the first agency
            if (state.data.length === 1) {
                state.activeAgencyId = action.payload.id.value;
            }
        },
        setAgency: (state, action: PayloadAction<Agency>) => {
            // For backward compatibility - replaces all with single agency
            state.data = [action.payload];
            state.activeAgencyId = action.payload.id.value;
        },
        setAgencies: (state, action: PayloadAction<Agency[]>) => {
            state.data = action.payload;
            if (action.payload.length > 0 && !state.activeAgencyId) {
                state.activeAgencyId = action.payload[0].id.value;
            }
        },
        updateAgency: (state, action: PayloadAction<{ id: string; data: Partial<Agency> }>) => {
            const index = state.data.findIndex(a => a.id.value === action.payload.id);
            if (index !== -1) {
                state.data[index] = { ...state.data[index], ...action.payload.data };
            }
        },
        removeAgency: (state, action: PayloadAction<string>) => {
            state.data = state.data.filter(a => a.id.value !== action.payload);
            // If removed agency was active, set first agency as active
            if (state.activeAgencyId === action.payload) {
                state.activeAgencyId = state.data.length > 0 ? state.data[0].id.value : null;
            }
        },
        setActiveAgency: (state, action: PayloadAction<string>) => {
            state.activeAgencyId = action.payload;
        },
        clearAgency: (state) => {
            state.data = [];
            state.activeAgencyId = null;
        }
    }
})

export default agencySlice;
