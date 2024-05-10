import { describe, it } from "mocha";
import { expect } from "chai";
import { RequestContext } from "../../src";

describe('RequestContext', () => {
    describe('constructor', () => {
        const REGEX_UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
        const REGEX_ISO_DATETIME = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/;

        it('should set different options', function () {
            let ctx = new RequestContext();
            let d: any = ctx.finalize();

            expect(d.type).to.be.eq('REQ-CTX');
            expect(d.id).to.be.match(REGEX_UUID);
            expect(d.startTime).to.be.match(REGEX_ISO_DATETIME);

            ctx = new RequestContext({
                ctxType: 'test-req-ctx',
                ctxIdFactory: () => Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5),
                dateTimeFormatter: (date) => `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}:${date.getUTCMilliseconds()}`,
            });

            d = ctx.finalize();

            expect(d.type).to.be.eq('test-req-ctx');
            expect(d.id).to.be.match(/[a-z]{5}/);
            expect(d.startTime).to.be.not.empty;
        });
    });

    describe('finalize', () => {
        it('should work correctly', function () {
            const ctx = new RequestContext();
            ctx.request = { 'headers': { 'Authorization': 'Bearer funky-bearer-token' }, params: 'a=1&b=2&c=3.14' };
            ctx.response = { 'status': 201, message: 'CREATED' };

            const d: any = ctx.finalize();

            expect(d.type).to.be.eq('REQ-CTX');
            expect(d.res).to.be.a('object');
            expect(d.res).to.be.empty;
            expect(d.req).to.be.a('object');
            expect(d.req).to.be.empty;
        });
    });
});
