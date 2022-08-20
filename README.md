# jsctx

`jsctx` is a package for creating a context for a flow like HTTP request, background jobs, etc.
Also, you can use this to pass data between function calls, use timers and log it as JSON format.

# Usage
```javascript
import { Context } from 'jsctx';

const ctx: Context = new Context();

// This set methods does not serialize, this is only for pass data between functions.
ctx
    .set('x', 1)
    .set('y', false)
    .set('z', '123');

const x = 100;
const y = (x + 1) * (x - 1);

ctx.log.setData('numbers/y', y);
ctx.log.setData('numbers/y.isEven', y % 2);

// The first way to using timer
const timer1 = ctx.log.startTimer('timer1');
setTimeout(() => {
    timer1.stop();
}, 1000);

// The second way to using timer
ctx.log.startTimer('timer2');
setTimeout(() => {
    const elapsedTime = ctx.log.stopTimer('timer2');
    ctx.log.setData('timer2/elapsedTime', elapsedTime);
}, 500);

// The third way to using timer (timer with sync function result)
const result = ctx.log.withTimer('timer3', () => {
    let sum = 0;
    for (let i = 1; i < 10000000; i++) {
        sum += i;
    }
    return sum;
});
ctx.log.setData('sum', result);

// The forth way to using timer (timer with async function result)
const result2 = await ctx.log.withTimerAsync('timer4', () => {
    return new Promise((resolve) => setTimeout(() => resolve('my result string'), 200));
});
ctx.log.setData('results/string', result2);

setTimeout(() => {
    // We are finalizing Context with timeout to see timers with setTimeouts
    console.log(JSON.stringify(ctx.finalize()));
}, 4000);
```

* The output will be:
```json
{
  "type": "CTX",
  "id": "bcbd45c1-7695-4b4f-acdb-6e3f0807ccf5",
  "startTime": "2022-08-20T21:20:44.156Z",
  "endTime": "2022-08-20T21:20:48.371Z",
  "data": {
    "numbers": {
      "y": 9999,
      "y.isEven": 1
    },
    "sum": 49999995000000,
    "results": {
      "string": "my result string"
    },
    "timer2": {
      "elapsedTime": 504
    }
  },
  "timers": {
    "timer3.s": {
      "sum": 11,
      "cnt": 1,
      "min": 11,
      "max": 11,
      "avg": 11
    },
    "timer4.s": {
      "sum": 202,
      "cnt": 1,
      "min": 202,
      "max": 202,
      "avg": 202
    },
    "timer2": {
      "sum": 504,
      "cnt": 1,
      "min": 504,
      "max": 504,
      "avg": 504
    },
    "timer1": {
      "sum": 1002,
      "cnt": 1,
      "min": 1002,
      "max": 1002,
      "avg": 1002
    },
    "ALL": {
      "sum": 4215,
      "cnt": 1,
      "min": 4215,
      "max": 4215,
      "avg": 4215
    }
  }
}
```
