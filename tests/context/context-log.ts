import { describe, it } from "mocha";
import { Context } from "../../src";
import { expect } from "chai";

describe('ContextLog', () => {
    describe('withTimer', () => {
        it('should return correct value', function () {
            const ctx = new Context({
                ctxType: 'TestCTX'
            });
            const value = 1;

            const result = ctx.log.withTimer('tests/timer', () => {
                return value;
            });

            expect(result).to.be.eq(value);
            expect(result).to.be.not.eq(undefined);
            expect(result).to.be.not.eq(2);
        });
    });

    describe('withTimerAsync', () => {
        it('should return correct value', async function () {
            const ctx = new Context({
                ctxType: 'TestCTX'
            });
            const value = 1;

            const result = await ctx.log.withTimerAsync('tests/timer', async () => {
                return new Promise((resolve) => setTimeout(() => resolve(value), 5));
            });

            expect(result).to.be.a(typeof value);
            expect(result).to.be.not.a('Promise');
            expect(result).to.be.eq(value);
            expect(result).to.be.not.eq(null);
            expect(result).to.be.not.eq(2);
        });
    });
});
