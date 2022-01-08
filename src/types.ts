export interface JsonObject extends Object {
    [key: string]: unknown;
}

export type ContextLogOptions = {
    timerKeyForAll: string;
}

export type ContextOptions = {
    ctxType?: string;
    ctxIdFactory?: () => string;
    dateTimeFormatter?: (date: Date) => string;
    logOptions?: ContextLogOptions;
}
