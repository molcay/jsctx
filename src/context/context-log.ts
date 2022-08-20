import { ContextLogOptions, JsonObject } from "../types";
import { Context } from "./context";
import { Counter } from "./counter";
import { Timer } from "./timer";
import { isArray, isUndefinedOrNull } from "../helpers";

export class ContextLog {
    private ctx: Context;
    private options: ContextLogOptions;
    private data: JsonObject = {};
    private timers: { [key: string]: Timer } = {};
    private timerCounters: { [key: string]: Counter } = {};

    constructor(ctx: Context, options: ContextLogOptions) {
        this.ctx = ctx;
        this.options = options;
        this.startTimer(this.options.timerKeyForAll);
    }

    public setData(key: string, value: unknown): ContextLog {
        update(key.split('/'), this.data, value);
        return this;
    }

    public addData(key: string, ...values: unknown[]): ContextLog {
        values.forEach((value => {
            update(key.split('/'), this.data, value, 0, true);
        }));
        return this;
    }

    // TODO implement this
    // public count(key: string, value: unknown) {}

    // TODO implement this
    // public increment(key: string, incBy = 1) {}

    public setStatus(key: string, value: unknown): ContextLog {
        this.setData(key, !!value);
        return this;
    }

    public startTimer(key: string): Timer {
        const timer = new Timer(key, this);
        this.timers[key] = timer;
        return timer;
    }

    public setTimer(key: string, timeSpent: number) {
        const counter: Counter | undefined = this.timerCounters[key];
        if (!counter) {
            this.timerCounters[key] = new Counter(timeSpent);
        } else {
            counter.add(timeSpent);
        }

        return this;
    }

    public withTimer<T>(key: string, f: () => T): T {
        const timer: Timer = this.startTimer(key);
        let status;
        try {
            const v = f();
            status = Timer.STATUS_SUCCESS;
            return v;
        } catch (e) {
            status = Timer.STATUS_FAILURE;
            throw e;
        } finally {
            timer.stop(status);
        }
    }

    public async withTimerAsync<T>(key: string, f: () => T): Promise<T> {
        const timer: Timer = this.startTimer(key);
        let status;
        try {
            const v = await f();
            status = Timer.STATUS_SUCCESS;
            return v;
        } catch (e) {
            status = Timer.STATUS_FAILURE;
            throw e;
        } finally {
            timer.stop(status);
        }
    }

    public finalize(): { data: JsonObject, timers: JsonObject } {
        this.setTimer(this.options.timerKeyForAll, this.ctx.elapsed);

        const data = this.data;
        const timers = {};
        Object.keys(this.timerCounters).forEach((key) => {
            const counter = this.timerCounters[key];
            update(key.split('/'), timers, counter.toObject());
        });

        return {
            data,
            timers,
        };
    }
}


function update(path: string[], obj: JsonObject, value: unknown, i = 0, isAdd = false) {
    const key: string = path[i];

    if (i === path.length - 1) { // we are at the leaf, so we can set the value
        if (isAdd) {
            const existingValue = obj[key];
            let newValue = null;
            if (isArray(existingValue)) {
                newValue = (existingValue as unknown[]).concat(value);
            } else if (isUndefinedOrNull(newValue)) {
                newValue = Array.of(value);
            } else {
                newValue = Array.of(existingValue, value);
            }

            obj[key] = newValue;
        } else {
            obj[key] = value;
        }
    } else {
        const child: JsonObject = (obj[key] as JsonObject) || {};
        obj[key] = child;

        update(path, child, value, i + 1, isAdd);
    }
}
