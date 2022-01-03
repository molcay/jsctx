import { JsonObject } from "../types";

export class Counter {
    private min: number;
    private max: number;
    private sum: number;
    private cnt: number;

    constructor(time: number) {
        this.min = time;
        this.max = time;
        this.sum = time;
        this.cnt = 1;
    }

    private get avg(): number {
        return Math.round(this.sum / this.cnt);
    }

    public add(time: number): Counter {
        this.sum += time;
        this.cnt += 1;
        this.min = Math.min(this.min, time);
        this.max = Math.max(this.max, time);

        return this;
    }

    public toObject(): JsonObject {
        return {
            sum: this.sum,
            cnt: this.cnt,
            min: this.min,
            max: this.max,
            avg: this.avg,
        };
    }
}
