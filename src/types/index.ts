import type { Field } from "./Field";
import { sidebarContent } from "../data";

// export type ControlPanel = typeof controlPanels[number];

export type Point = {
    lat: number,
    lng: number,
};

export type Sidebar = typeof sidebarContent[number];

export type Stop ={
    id: Field<string>,
    name: Field<string>
}

export type {Field} from "./Field"