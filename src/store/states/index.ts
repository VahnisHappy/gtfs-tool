import type { Stop, Sidebar } from "../../types";

export type AppState ={
    sidebarContent: Sidebar
}

export type StopState = {
    data: Stop[],
}