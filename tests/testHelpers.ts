import { expect } from "chai";

export function assertSingleCounterData(d: any, t: number) {
    expect(d.min).to.be.a('number');
    expect(d.min).to.be.gte(t);
    expect(d.max).to.be.a('number');
    expect(d.max).to.be.gte(t);
    expect(d.sum).to.be.a('number');
    expect(d.sum).to.be.gte(t);
    expect(d.cnt).to.be.a('number');
    expect(d.cnt).to.be.eq(1);
}

export function assertMultipleCounterData(d: any, values: number[]) {
    expect(d.min).to.be.eq(Math.min(...values));
    expect(d.min).to.be.a('number');
    expect(d.max).to.be.eq(Math.max(...values));
    expect(d.max).to.be.a('number');
    expect(d.sum).to.be.eq(values.reduce((a, c) => a + c, 0));
    expect(d.sum).to.be.a('number');
    expect(d.cnt).to.be.eq(values.length);
    expect(d.cnt).to.be.a('number');
}
