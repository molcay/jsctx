import { v4 as uuid } from 'uuid';

import { ContextOptions, RequestContextOptions } from "./types";

export const DEFAULT_CONTEXT_OPTIONS: ContextOptions = {
    ctxType: 'CTX',
    ctxIdFactory: () => uuid(),
    extrasFactory: () => ({}),
    datetimeFormat: (date: Date) => date.toISOString(),
    logOptions: {
        timerKeyForAll: 'ALL',
    }
};

export const DEFAULT_REQUEST_OPTIONS: RequestContextOptions = {
    ...DEFAULT_CONTEXT_OPTIONS,
    reqIdFactory: () => uuid(),
};
