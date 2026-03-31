import type { Stop, Content, Route, Mode, Field, Bounds, Calendar, Trip, Point } from "../../types";
import type { ViewState } from "react-map-gl/mapbox";
import type { PlannedStation } from "../../services/stationPlanner";
import type { ExternalPOI } from "../../services/mapboxPOI";

export type AppState = {
    content: Content
    isStopDetailOpen: boolean;
    isRouteDetailOpen?: boolean;
    isCalendarDetailOpen?: boolean;
    isTripDetailOpen?: boolean;
    selectedStop: (Stop & { mode: 'new' | 'edit'; stopIndex?: number }) | null;
    selectedRoute: (Route & { mode: 'new' | 'edit'; routeIndex?: number }) | null;
    selectedCalendar: (Calendar & { mode: 'new' | 'edit'; calendarIndex?: number }) | null;
    selectedTrip: (Trip & { mode: 'new' | 'edit'; tripIndex?: number }) | null;
    mode: Mode;
    polygonVertices: Point[];
    polygonClosed: boolean;
    isPolygonPanelOpen: boolean;
    stationPlanPointA: Point | null;
    stationPlanPointB: Point | null;
    stationCount: number;
    plannedStations: PlannedStation[];
    stationPlanRoutePath: Point[];
    selectedPOIs: ExternalPOI[];
}

export type StopState = {
    data: Stop[],
    selectedIndex: number | null
}

export type RouteState = {
    data: Route[],
    currentRoute: Route | null;
}

export type CalendarState = {
    data: Calendar[]
}

export type TripState = {
    data: Trip[],
}

export type MapState = {
    accessToken: string,
    mapStyle: string,
    location: Field<string>,
    bounds?: Bounds,
    viewState?: Partial<ViewState>,
    flyTo?: { lat: number, lng: number, zoom?: number } | null
}

export type LocationState = {
    location: Field<string>
}

