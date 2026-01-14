export type Field<T> = {
    value: T,
    error?: boolean
}

// export type UnwrapField<T> = T extends Field<infer U> ? U : T;

export type UnwrapType<T> = T extends Field<infer U> ? U : NonNullable<T>;