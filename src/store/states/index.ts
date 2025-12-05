import type { Stop, Content, Route, Mode, Field } from "../../types";

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
    location: {
        lat: number;
        lng: number;
        zoom: number;
    }
}

export type LocationState = {
    location: Field<string>
}