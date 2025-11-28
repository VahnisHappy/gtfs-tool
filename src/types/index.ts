import type { Field } from "./Field";
import { sidebarContent, modes } from "../data";


export type Content = typeof sidebarContent[number]

export type Mode = typeof modes[number]

export type Point = {
    lat: number,
    lng: number,
};

export type Stop = {
    id: Field<string>,
    name: Field<string>,
    lat: number,
    lng: number
}

export type Route = {
    id: Field<string>,
    name: Field<string>
}

export type {Field} from "./Field"