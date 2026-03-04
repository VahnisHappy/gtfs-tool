import type { Calendar, ExceptionDate, Field, Point, Route, Stop, StopTime, Time, Trip } from "../types"

export function createField<T>(value: T, optional?: boolean): Field<T> {
    return {value, error: !optional}
}

export function createStop(point: Point): Stop {
    return {
        ...point,
        id: createField(""),
        name: createField("")
    }
}

export function createRoute(color: string): Route {
    return {
        id: createField(""),
        name: createField(""),
        path: [],
        stopIndexes: [],
        color,
        routeType: 3, // Default to bus
        stopIds: [],
        edit: false,
    }
}

export function createCalendar(): Calendar {
    return {
        id: createField(""),
        startDate: createField<string | null>(null),
        endDate: createField<string | null>(null),
        days: [false, false, false, false, false, false, false], // Mon-Sun
        exception: 0,
        exceptions: []
    }
}

export function createTrip(): Trip {
    return {
        id: createField(""),
        route: createField<number | null>(null),
        calendar: createField<number | null>(null),
        stopTimes: []
    }
}

export function createStopTime(): StopTime {
    return {
        arrivalTime: createField<Time | null>(null),
        departureTime: createField<Time | null>(null),
        stopIndex: -1
    }
}

export function createExceptionDate(): ExceptionDate {
    return {
        id: createField(""),
        date: createField<string | null>(null),
        type: createField("1") // Default to "1" (service added)
    }
}