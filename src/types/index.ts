import type { Field } from "./Field";
import { sidebarContent, modes } from "../data";

export type Content = typeof sidebarContent[number]

export type MapData = {
    routes: Route[],
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
    lng: number,
    code?: Field<string>,
    tlsName?: Field<string>,
    zoneId?: Field<string>,
    locationType?: Field<string>,
    url?: Field<string>,
    parentStation?: Field<string>,
    timezone?: Field<string>,
    wheelchairBoarding?: Field<string>,
    levelId?: Field<string>,
    platformCode?: Field<string>,
    access?: Field<string>,
    description?: Field<string>,
}

export type StopIndex = number

export type Route = {
    id: Field<string>,
    name: Field<string>,
    stopIndexes: StopIndex[],
    path: Point[],
    color: string,
    edit?: boolean,
}

export type RouteIndex = number

export type Bounds = [number, number, number, number]

export type StopGeoJSON = GeoJSON.Feature<GeoJSON.Point, {
    id: string
    name?: string
}>

export type StopsGeoJSONCollection = GeoJSON.FeatureCollection<GeoJSON.Point>

export type { Field } from "./Field"