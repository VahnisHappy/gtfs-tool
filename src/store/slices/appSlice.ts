import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../states";
import type { Content, Point } from "../../types";
import type { modes } from "../../data";
import type { PlannedStation } from "../../services/stationPlanner";
import type { ExternalPOI } from "../../services/mapboxPOI";

const initialState: AppState = {
    content: 'project',
    isStopDetailOpen: false,
    selectedStop: null,
    isRouteDetailOpen: false,
    selectedRoute: null,
    isCalendarDetailOpen: false,
    selectedCalendar: null,
    isTripDetailOpen: false,
    selectedTrip: null,
    mode: 'view',
    polygonVertices: [],
    polygonClosed: false,
    isPolygonPanelOpen: false,
    stationPlanPointA: null,
    stationPlanPointB: null,
    stationCount: 3,
    plannedStations: [],
    stationPlanRoutePath: [],
    selectedPOIs: []
}

const appSlice = createSlice({
    name: "appState",
    initialState,
    reducers: {
        setContent: (state, { payload }: PayloadAction<Content>) => {
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
        updateStopCoordinates: (state, action: PayloadAction<{ lat: number; lng: number; stopIndex?: number }>) => {
            if (state.selectedStop) {
                state.selectedStop.lat = action.payload.lat;
                state.selectedStop.lng = action.payload.lng;
                if (action.payload.stopIndex !== undefined) {
                    state.selectedStop.stopIndex = action.payload.stopIndex;
                }
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
        },
        enterPolygonMode: (state) => {
            state.mode = 'polygon';
            state.polygonVertices = [];
            state.polygonClosed = false;
            state.isPolygonPanelOpen = false;
        },
        addPolygonVertex: (state, action: PayloadAction<Point>) => {
            if (!state.polygonClosed) {
                state.polygonVertices.push(action.payload);
            }
        },
        closePolygon: (state) => {
            state.polygonClosed = true;
            state.isPolygonPanelOpen = true;
        },
        clearPolygon: (state) => {
            state.polygonVertices = [];
            state.polygonClosed = false;
            state.isPolygonPanelOpen = false;
            state.stationPlanPointA = null;
            state.stationPlanPointB = null;
            state.plannedStations = [];
            state.stationPlanRoutePath = [];
            state.selectedPOIs = [];
            state.mode = 'view';
        },
        openPolygonPanel: (state) => {
            state.isPolygonPanelOpen = true;
        },
        closePolygonPanel: (state) => {
            state.isPolygonPanelOpen = false;
        },
        setStationPlanPointA: (state, action: PayloadAction<Point>) => {
            state.stationPlanPointA = action.payload;
        },
        setStationPlanPointB: (state, action: PayloadAction<Point>) => {
            state.stationPlanPointB = action.payload;
        },
        setStationCount: (state, action: PayloadAction<number>) => {
            state.stationCount = action.payload;
        },
        setPlannedStations: (state, action: PayloadAction<PlannedStation[]>) => {
            state.plannedStations = action.payload;
        },
        clearStationPlan: (state) => {
            state.stationPlanPointA = null;
            state.stationPlanPointB = null;
            state.plannedStations = [];
            state.stationPlanRoutePath = [];
            state.stationCount = 3;
        },
        setStationPlanRoutePath: (state, action: PayloadAction<Point[]>) => {
            state.stationPlanRoutePath = action.payload;
        },
        setSelectedPOIs: (state, action: PayloadAction<ExternalPOI[]>) => {
            state.selectedPOIs = action.payload;
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
    closeTripDetail,
    enterPolygonMode,
    addPolygonVertex,
    closePolygon,
    clearPolygon,
    openPolygonPanel,
    closePolygonPanel,
    setStationPlanPointA,
    setStationPlanPointB,
    setStationCount,
    setPlannedStations,
    clearStationPlan,
    setStationPlanRoutePath,
    setSelectedPOIs
} = appSlice.actions;
export default appSlice;