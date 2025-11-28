import type { Field, Point, Stop } from "../types"

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