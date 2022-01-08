import { v4 as uuid } from 'uuid';

import { ContextOptions } from "./types";

export const DEFAULT_CONTEXT_OPTIONS: ContextOptions = {
    ctxType: 'CTX',
    ctxIdFactory: () => uuid(),
    dateTimeFormatter: (date: Date) => date.toISOString(),
    logOptions: {
        timerKeyForAll: 'ALL',
    }
};
