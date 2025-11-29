import type { Stop, Content, Route, Mode } from "../../types";

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