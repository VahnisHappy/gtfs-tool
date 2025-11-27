import type { Field } from "./Field";
import { sidebarContent } from "../data";

export type Point = {
    lat: number,
    lng: number,
};

export type Content = typeof sidebarContent[number];

export type Stop = {
    id: Field<string>,
    name: Field<string>
}

export type Route = {
    id: Field<string>,
    name: Field<string>
}

export type {Field} from "./Field"