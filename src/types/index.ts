import type { Field } from "./Field";
import { sidebarContent, modes } from "../data";


export type Content = typeof sidebarContent[number]

export type MapData = {
    routes: Route[],
}

export type Map ={
    accessToken: string;
    mapStyle: string;
    location?: {
        lat: number;
        lng: number;
        zoom?: number;
    }
}

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

export type StopIndex = number

export type Route = {
    id: Field<string>,
    name: Field<string>
}

export type StopGeoJSON = GeoJSON.Feature<GeoJSON.Point, {
    id: string
    name?: string
}>

export type StopsGeoJSONCollection = GeoJSON.FeatureCollection<GeoJSON.Point>


export type {Field} from "./Field"