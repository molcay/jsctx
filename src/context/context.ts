import { now } from '../helpers';
import { ContextLogOptions, ContextOptions, JsonObject } from "../types";
import { DEFAULT_CONTEXT_OPTIONS } from "../constants";
import { ContextLog } from "./context-log";


export class Context {
    public id: string;
    private readonly ctxType: string;
    private readonly dateTimeFormatter: (date: Date) => string;
    private readonly startTime: Date;
    private endTime: Date | null = null;
    private readonly data: JsonObject;
    private options: ContextOptions;
    public log: ContextLog;
    private isFinalized = false;
    private finalizedData: JsonObject;

    constructor(options: ContextOptions = DEFAULT_CONTEXT_OPTIONS) {
        this.options = options;
        this.ctxType = this.options.ctxType ||
            DEFAULT_CONTEXT_OPTIONS.ctxType as string;
        const idFactory = this.options.ctxIdFactory ||
            DEFAULT_CONTEXT_OPTIONS.ctxIdFactory as () => string;
        this.dateTimeFormatter = this.options.dateTimeFormatter ||
            DEFAULT_CONTEXT_OPTIONS.dateTimeFormatter as (date: Date) => string;
        const contextLogOptions = this.options.logOptions ||
            DEFAULT_CONTEXT_OPTIONS.logOptions as ContextLogOptions;

        this.id = idFactory();
        this.startTime = now();
        this.log = new ContextLog(this, contextLogOptions);
        this.data = {};
        this.finalizedData = {};
    }

    public set(key: string, value: unknown): Context {
        this.data[key] = value;
        return this;
    }

    public get<T>(key: string, _default: T | undefined = undefined, setIfMissing = false): T | undefined {
        if (!(key in this.data)) {
            if (setIfMissing ) {
                (this.data as JsonObject)[key] = _default;
            }
            return _default;
        }
        return (this.data as JsonObject)[key] as T;
    }

    public remove(key: string): void {
        delete (this.data as JsonObject)[key];
    }

    public get elapsed(): number {
        const startTime = this.startTime.getTime();
        if (this.endTime) {
            return this.endTime.getTime() - startTime;
        } else {
            return Date.now() - startTime;
        }
    }

    /**
     * This method is for appending special data for child classes.
     */
    public get extras(): object {
        return {};
    }

    public finalize(logFunction = console.info): object {
        if (this.isFinalized) {  // already finalized context
            logFunction('Context is already finalized!');
            return this.finalizedData;
        }

        // first time calling finalize
        if (this.endTime === null) {
            this.endTime = now();
        }
        try {
            const { data, timers } = this.log.finalize();

            this.finalizedData = {
                type: this.ctxType,
                id: this.id,
                startTime: this.dateTimeFormatter(this.startTime),
                endTime: this.dateTimeFormatter(this.endTime),
                data,
                timers,
                ...this.extras,
            };
            this.isFinalized = true;

        } catch (e) {
            logFunction(`Error occurred while serializing the context! ${e}`);
        }
        return this.finalizedData;
    }
}
