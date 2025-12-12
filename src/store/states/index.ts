import type { Stop, Content, Route, Mode, Field, Bounds } from "../../types";
import type { ViewState } from "react-map-gl/mapbox";

export type AppState ={
    content: Content
    isStopDetailOpen: boolean;
    isRouteDetailOpen?: boolean;
    selectedStop: (Stop & { mode: 'new' | 'edit'; stopIndex?: number }) | null;
    selectedRoute: (Route & { mode: 'new' | 'edit'; routeIndex?: number }) | null;
    mode: Mode;
}

export type StopState = {
    data: Stop[],
}

export type RouteState = {
    data: Route[],
    currentRoute: Route | null;
}

export type MapState = {
    accessToken: string,
    mapStyle: string,
    location: Field<string>,
    bounds?: Bounds,
    viewState?: Partial<ViewState>
}

export type LocationState = {
    location: Field<string>
}