import type { Field, UnwrapType } from "./Field";
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

export type StopFormState = {
    [K in keyof Stop]-?: UnwrapType<Stop[K]> extends number 
        ? number | undefined 
        : string
}

export type StopIndex = number

export type Route = {
    id: Field<string>,
    name: Field<string>,
    routeType: number,
    stopIndexes: StopIndex[],
    stopIds?: string[], // For saving to database - actual stop IDs
    path: Point[],
    color: string,
    edit?: boolean,
    isNew?: boolean,
}

export type RouteFormData = {
    id: Field<string>,
    routeName: Field<string>,
    routeType: number,
    routeLongName?: Field<string>,
    routeDesc?: Field<string>,
    routeUrl?: Field<string>,
    routeColor?: Field<string>,
    routeTextColor?: Field<string>,
    routeSortOrder?: number,
    continuousPickup?: Field<string>,
    continuousDropOff?: Field<string>,
    networkId?: Field<string>,
    cemvSupport?: Field<string>,
}

export type BooleanDays = [boolean, boolean, boolean, boolean, boolean, boolean, boolean];

// export type ADate = {
//     date: number,
//     month: number,
//     year: number,
// }

export type Calendar = {
    id: Field<string>,
    startDate: Field<string | null>,
    endDate: Field<string | null>,
    days: BooleanDays,
    exception: number,
    exceptions?: ExceptionDate[]
}

export type ExceptionDate ={
    id: Field<string>,
    date: Field<string | null>,
    type: Field<string>,
}

export type CalendarIndex = number;

export type RouteIndex = number

export type Bounds = [number, number, number, number]

export type Time = {
    hour: number,
    minute: number,
    second: number
}

export type StopTime = {
    arrivalTime: Field<Time | null>,
    departureTime: Field<Time | null>,
    stopIndex: number
}

export type Trip = {
    id: Field<string>,
    route: Field<RouteIndex | null>,
    calendar: Field<CalendarIndex | null>,
    stopTimes: StopTime[],
}

export type TripIndex = number

export type StopTimeIndex = number

export type StopGeoJSON = GeoJSON.Feature<GeoJSON.Point, {
    id: string
    name?: string
}>

export type StopsGeoJSONCollection = GeoJSON.FeatureCollection<GeoJSON.Point>

export type { Field } from "./Field"