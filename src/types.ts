export interface JsonObject extends Object {
    [key: string]: unknown;
}

export type ContextLogOptions = {
    timerKeyForAll: string;
}

export type ContextOptions = {
    ctxType: string;
    ctxIdFactory: () => string;
    extrasFactory: () => object;
    datetimeFormat: (date: Date) => string;
    logOptions: ContextLogOptions;
}

export type RequestContextOptions = ContextOptions & {
    reqIdFactory: () => string;
}
