import { now } from '../helpers';
import { ContextOptions, JsonObject } from "../types";
import { DEFAULT_CONTEXT_OPTIONS } from "../constants";
import { ContextLog } from "./context-log";


export class Context {
    public id: string;
    private readonly ctxType: string;
    private readonly startTime: Date;
    private endTime: Date | null = null;
    private readonly data: JsonObject;
    private options: ContextOptions;
    public log: ContextLog;

    constructor(options: ContextOptions = DEFAULT_CONTEXT_OPTIONS) {
        this.options = options;
        this.ctxType = this.options.ctxType;
        this.id = this.options.ctxIdFactory();
        this.startTime = now();
        this.data = {};
        this.log = new ContextLog(this, this.options.logOptions);
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

    public finalize(): object {
        if (this.endTime === null) {
            this.endTime = now();
        }

        const { data, timers } = this.log.finalize();

        return {
            type: this.ctxType,
            id: this.id,
            startTime: this.options.datetimeFormat(this.startTime),
            endTime: this.options.datetimeFormat(this.endTime),
            data,
            timers,
            ...this.options.extrasFactory(),
        };
    }
}
