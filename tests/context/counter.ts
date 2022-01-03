import { describe, it } from 'mocha';
import { Counter } from '../../src';
import { assertMultipleCounterData, assertSingleCounterData } from "../testHelpers";


describe('Counter', () => {
    describe('single value', () => {
        it('should works correctly', () => {
            const counter: Counter = new Counter(60);
            assertSingleCounterData(counter.toObject(), 60);
        });
    });

    describe('multiple value', () => {
        it('should works correctly', () => {
            const counter: Counter = new Counter(60);
            counter
                .add(50)
                .add(10);

            assertMultipleCounterData(counter.toObject(), [60, 50 ,10]);
        });
    });
});
