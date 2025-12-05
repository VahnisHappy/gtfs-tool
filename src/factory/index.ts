import type { Field, Point, Route, Stop, StopGeoJSON } from "../types"

export function createField<T>(value: T, optional?: boolean): Field<T> {
    return {value, error: !optional}
}

export function createStop(point: Point): Stop {
    return {
        ...point,
        id: createField(`stop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
        name: createField(`Stop ${Date.now()}`)
    }
}

export const stopToGeoJSON = (stop: Stop): StopGeoJSON => {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [stop.lng, stop.lat]
        },
        properties: {
            id: stop.id.value,  // Extract the value from Field
            name: stop.name.value  // Extract the value from Field
        }
    }
}

export const stopsToGeoJSONCollection = (stops: Stop[]): GeoJSON.FeatureCollection => {
    return {
        type: 'FeatureCollection',
        features: stops.map(stopToGeoJSON)
    }
}

export function createRoute(color: string): Route {
    return {
        id: createField(""),
        name: createField(""),
        path: [],
        stopIndexes:[],
        color,
        edit: false
    }
}