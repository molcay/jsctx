import { describe, it } from 'mocha';
import { expect } from 'chai';
import { now, isNull, isUndefined, isUndefinedOrNull, isArray } from "../src/helpers";

describe('Testing for helpers', () => {
    describe('now', () => {
        it('should return Date', () => {
            const n = now();
            expect(n).to.be.a('Date');
        });
    });
    describe('isNull', () => {
        it('should return true for null value', () => {
            const b = isNull(null);
            expect(b).to.be.true;
        });
        it('should return false for undefined', () => {
            const b = isNull(undefined);
            expect(b).to.be.false;
        });
        it('should return false for NaN', () => {
            const b = isNull(NaN);
            expect(b).to.be.false;
        });
        it('should return false for any other value', () => {
            const b = isNull(false);
            expect(b).to.be.false;
        });
    });
    describe('isUndefined', () => {
        it('should return true for undefined value', () => {
            const b = isUndefined(undefined);
            expect(b).to.be.true;
        });
        it('should return false for null value', () => {
            const b = isUndefined(null);
            expect(b).to.be.false;
        });
        it('should return false for NaN value', () => {
            const b = isUndefined(NaN);
            expect(b).to.be.false;
        });
        it('should return false for any other value', () => {
            const b = isUndefined(false);
            expect(b).to.be.false;
        });
    });
    describe('isUndefinedOrNull', () => {
        it('should return true for undefined value', () => {
            const b = isUndefinedOrNull(undefined);
            expect(b).to.be.true;
        });
        it('should return true for null value', () => {
            const b = isUndefinedOrNull(null);
            expect(b).to.be.true;
        });
        it('should return false for NaN value', () => {
            const b = isUndefinedOrNull(NaN);
            expect(b).to.be.false;
        });
        it('should return false for any other value', () => {
            const b = isUndefinedOrNull(false);
            expect(b).to.be.false;
        });
    });
    describe('isArray', () => {
        it('should return true for empty array', () => {
            const b = isArray([]);
            expect(b).to.be.true;
        });
        it('should return true for non-empty array', () => {
            const b = isArray([1,2,3]);
            expect(b).to.be.true;
        });
        it('should return false for empty object', () => {
            const b = isArray({});
            expect(b).to.be.false;
        });
        it('should return false for non-empty object', () => {
            const b = isArray({ x: 1, y: 2 });
            expect(b).to.be.false;
        });
        it('should return false for primitive types', () => {
            expect(isArray(true)).to.be.false;
            expect(isArray(false)).to.be.false;
            expect(isArray(1)).to.be.false;
            expect(isArray(0)).to.be.false;
            expect(isArray(-1)).to.be.false;
            expect(isArray(3.14)).to.be.false;
            expect(isArray('string')).to.be.false;
            expect(isArray('')).to.be.false;
        });
    });
});
