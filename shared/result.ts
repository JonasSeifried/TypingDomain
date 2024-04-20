export type Result<T, E extends Error = Error> = Ok<T, E> | Err<any, E>

export class Ok<T, E extends Error = Error> {
    public constructor(public readonly value: T) {}

    public isOk(): this is Ok<T, E> {
        return true
    }

    public isErr(): this is Err<T, E> {
        return false
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public unwrapOr(_defaultValue: T): T {
        return this.value
    }
}

export class Err<T, E extends Error = Error> {
    public constructor(public readonly error: E) {}

    public isOk(): this is Ok<T, E> {
        return false
    }

    public isErr(): this is Err<T, E> {
        return true
    }

    public unwrapOr(defaultValue: T): T {
        return defaultValue
    }
}

export function ok<T, E extends Error>(value: T): Ok<T, E>
export function ok<T>(value: T): Ok<T>
export function ok(): Ok<void>
export function ok<T>(value?: T): Ok<T> | Ok<void> {
    if (value === undefined) return new Ok(undefined)
    return new Ok(value)
}

export function err<T, E extends Error = Error>(error: E): Err<T, E> {
    return new Err(error)
}

export type WebResult<T, E extends Error = Error> =
    | { success: true; value: T }
    | { success: false; error: E }

export function webOk<T, E extends Error>(result: T): WebResult<T, E>
export function webOk<T>(result: T): WebResult<T>
export function webOk(): WebResult<void>
export function webOk<T>(result?: T): WebResult<T> | WebResult<void> {
    if (result === undefined)
        return {
            success: true,
            value: undefined
        }
    return { success: true, value: result }
}

export function webErr<E extends Error = Error>(error: E): WebResult<any, E> {
    return { success: false, error }
}

export function fromWebResult<T, E extends Error>(webResult: WebResult<T, E>): Result<T, E> {
    return webResult.success === true ? ok(webResult.value) : err(webResult.error)
}

export function fromResult<T, E extends Error>(result: Result<T, E>): WebResult<T, E> {
    return result.isOk() ? webOk(result.value) : webErr(result.error)
}

export function ensureError(value: unknown): Error {
    if (value instanceof Error) return value

    let stringified = '[Unable to stringify the thrown value]'
    try {
        stringified = JSON.stringify(value)
    } catch {
        /* empty */
    }

    const error = new Error(`This value was thrown as is, not through an Error: ${stringified}`)
    return error
}
