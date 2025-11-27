import type { Stop, Content, Route } from "../../types";

export type AppState ={
    content: Content
}

export type StopState = {
    data: Stop[],
}

export type RouteState = {
    data: Route[]
}