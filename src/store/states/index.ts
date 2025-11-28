import type { Stop, Content, Route } from "../../types";

export type AppState ={
    content: Content
    isStopDetailOpen: boolean;
    selectedStop: any | null;
}

export type StopState = {
    data: Stop[],
}

export type RouteState = {
    data: Route[]
}