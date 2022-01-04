import { describe, it } from "mocha";
import { expect } from "chai";
import { Timer } from "../../src";
import { ContextLog } from "../../src";
import { Context } from "../../src";
import { DEFAULT_CONTEXT_OPTIONS } from "../../src/constants";
import { assertSingleCounterData } from "../testHelpers";


describe('Timer', () => {
    it('stop with failure should works correctly', () => {
        const ctx = new Context();
        const log = new ContextLog(ctx, DEFAULT_CONTEXT_OPTIONS.logOptions);
        const waitTime = 35;
        const timer: Timer = new Timer('timer1', log);

        setTimeout(() => {
            timer.stop(Timer.STATUS_FAILURE);
            expect(timer.elapsedTime).to.be.a('number');
            expect(timer.elapsedTime).to.be.gte(waitTime);

            const logData = log.finalize();
            expect(logData.timers).to.have.property('timer1.f');

            const timerData = logData.timers['timer1.f'] as any;
            assertSingleCounterData(timerData, waitTime);
        }, waitTime);
    });

    it('stop with success should works correctly', () => {
        const ctx = new Context();
        const log = new ContextLog(ctx, DEFAULT_CONTEXT_OPTIONS.logOptions);
        const waitTime = 25;
        const timer: Timer = new Timer('timer2', log);

        setTimeout(() => {
            timer.stop(Timer.STATUS_SUCCESS);
            expect(timer.elapsedTime).to.be.a('number');
            expect(timer.elapsedTime).to.be.gte(waitTime / 2);
            expect(timer.elapsedTime).to.be.lte(waitTime * 2);

            const logData = log.finalize();
            expect(logData.timers).to.have.property('timer2.s');

            const timerData = logData.timers['timer2.s'] as any;
            assertSingleCounterData(timerData, waitTime);
        }, waitTime);
    });

    it('stop without status should works correctly', () => {
        const ctx = new Context();
        const log = new ContextLog(ctx, DEFAULT_CONTEXT_OPTIONS.logOptions);
        const waitTime = 15;
        const timer: Timer = new Timer('timer3', log);

        setTimeout(() => {
            timer.stop();
            expect(timer.elapsedTime).to.be.a('number');
            expect(timer.elapsedTime).to.be.gte(waitTime / 2);
            expect(timer.elapsedTime).to.be.lte(waitTime * 2);

            const logData = log.finalize();
            expect(logData.timers).to.have.property('timer3');

            const timerData = logData.timers['timer3'] as any;
            assertSingleCounterData(timerData, waitTime);
        }, waitTime);
    });

    // TODO implement test for multiple timers with same key name
    // TODO implement test for multiple timers with different key names
});
