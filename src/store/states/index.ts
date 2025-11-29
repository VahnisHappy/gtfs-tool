import type { Stop, Content, Route, Mode, Field } from "../../types";

export type AppState ={
    content: Content
    isStopDetailOpen: boolean;
    selectedStop: any | null;
    mode: Mode;
}

export type StopState = {
    data: Stop[],
}

export type RouteState = {
    data: Route[]
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