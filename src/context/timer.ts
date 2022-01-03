import { now } from "../helpers";
import { ContextLog } from "./context-log";

export class Timer {
    public static STATUS_SUCCESS = 's';
    public static STATUS_FAILURE = 'f';

    private readonly key: string;
    private readonly startTime: number;
    private endTime: number | undefined;
    private status: string | undefined;
    private log: ContextLog;

    constructor(key: string, log: ContextLog) {
        this.key = key;
        this.log = log;
        this.startTime = Timer.currentMillis();
    }

    private static currentMillis(): number {
        return now().getTime();
    }

    public get elapsedTime() {
        return this.endTime ? this.endTime - this.startTime : Timer.currentMillis() - this.startTime;
    }

    private get timerKey(): string {
        return !this.status ? this.key : `${this.key}.${this.status}`;
    }

    public stop(status?: string): number {
        if (status != undefined) {
            this.status = status;
        }

        this.endTime = Timer.currentMillis();
        const elapsedTime = this.elapsedTime;

        this.log.setTimer(this.timerKey, elapsedTime);

        return elapsedTime;
    }
}
