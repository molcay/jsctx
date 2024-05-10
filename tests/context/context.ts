import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Context } from "../../src";

describe('Context', () => {
    describe('constructor', () => {
        const REGEX_UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
        const REGEX_ISO_DATETIME = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/;

        it('should set different options', function () {
            let ctx = new Context({
                ctxType: 'TestCTX'
            });
            let d: any = ctx.finalize();

            expect(d.type).to.be.eq('TestCTX');
            expect(d.id).to.be.match(REGEX_UUID);
            expect(d.startTime).to.be.match(REGEX_ISO_DATETIME);

            ctx = new Context({
                ctxIdFactory: () => Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5),
            });
            d = ctx.finalize();

            expect(d.type).to.be.not.eq('TestCTX');
            expect(d.type).to.be.eq('CTX');
            expect(d.id).to.be.match(/[a-z]{5}/);
            expect(d.startTime).to.be.match(REGEX_ISO_DATETIME);

            ctx = new Context({
                dateTimeFormatter: (date) => `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}:${date.getUTCMilliseconds()}`,
            });
            d = ctx.finalize();

            expect(d.type).to.be.not.eq('TestCTX');
            expect(d.type).to.be.eq('CTX');
            expect(d.startTime).to.be.not.empty;
        });
    });

    describe('set', () => {
        it('should works correctly', () => {
            const ctx: Context = new Context();
            ctx
                .set('key1', 1)
                .set('key2', false);

            expect(ctx.get('key1')).to.be.eq(1);
            expect(ctx.get('key2')).to.be.eq(false);
        });
    });

    describe('remove', () => {
        it('should works correctly', () => {
            const ctx: Context = new Context();
            ctx
                .set('key1', 1)
                .set('key2', false)
                .remove('key1');

            expect(ctx.get('key2')).to.be.a('boolean');
            expect(ctx.get('key2')).to.be.eq(false);
            expect(ctx.get('key1')).to.be.eq(undefined);
        });
    });

    describe('get', () => {
        it('should works correctly', () => {
            const ctx: Context = new Context();
            ctx
                .set('key1', 1)
                .set('key2', false);

            expect(ctx.get('key1')).to.be.a('number');
            expect(ctx.get('key1')).to.be.eq(1);
            expect(ctx.get('key2')).to.be.a('boolean');
            expect(ctx.get('key2')).to.be.eq(false);
            expect(ctx.get('key3', 'value3')).to.be.a('string');
            expect(ctx.get('key3', 'value3')).to.be.eq('value3');

            expect(ctx.get('key4', 'value4', true)).to.be.a('string');
            expect(ctx.get('key4')).to.be.a('string');
            expect(ctx.get('key4')).to.be.eq('value4');
        });
    });

    describe('elapsed', () => {
        it('should works correctly', () => {
            const ctx: Context = new Context();
            ctx
                .set('key1', 1)
                .set('key2', false);
            setTimeout(() => {
                ctx.finalize();
                expect(ctx.elapsed).to.be.gte(50);
            }, 50);
        });
    });

    describe('finalize', () => {
        it('should works correctly', () => {
            const ctx: Context = new Context();
            ctx
                .set('x', 1)
                .set('y', false)
                .set('z', '123');

            setTimeout(() => {
                const ctxData = ctx.finalize() as any;
                expect(ctxData).to.be.a('object');
                expect(ctxData.type).to.be.eq('CTX');
                expect(ctxData.id).to.be.a('string');
                expect(ctxData.startTime).to.be.a('string');
                expect(ctxData.endTime).to.be.a('string');
                expect(ctxData.data).to.be.a('object');
                expect(ctxData.data).to.be.empty;
                expect(ctxData.timers).to.have.property('ALL');
                expect(ctxData.timers.ALL).to.have.property('cnt');
                expect(ctxData.timers.ALL.cnt).to.be.eq(1);
                expect(ctxData.timers.ALL).to.have.property('sum');
                expect(ctxData.timers.ALL.sum).to.be.gte(50);
                expect(ctxData.timers.ALL).to.have.property('min');
                expect(ctxData.timers.ALL).to.have.property('max');
                expect(ctxData.timers.ALL).to.have.property('avg');
            }, 50);
        });
    });
});
