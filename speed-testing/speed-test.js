import {
    Bezier,
    CubicBezier
} from './index.js';
import test from './speed-test-util.js';

const pa = {
    x: 0,
    y: 0
};
const pb = {
    x: 0.1,
    y: 0.5
};
const pc = {
    x: 0.9,
    y: 0.5
};
const pd = {
    x: 1,
    y: 1
};

const variantsToTest = [{
    name: "Bezier",
    instance: new Bezier(pa, pb, pc, pd)
}, {
    name: "CubicBezier",
    instance: new CubicBezier(pa, pb, pc, pd)
}];

const iterations = {
    repetition: 10,
    interReAlt: 10,
    stepsCycle: 500,
    stepsCount: 500,
}

document.addEventListener('DOMContentLoaded', function () {
    const output = document.getElementById('output');

    const testResult = test(variantsToTest, iterations);
    output.innerText = testResult;
})

/*

Firefox:

Testing Bezier and CubicBezier 500.000 times in each cycle (one line)

Configuration:
  repetition: 10
  interRepetitionAlternation: 10
  stepsCycle: 1000
  stepsCount: 50

Bezier: 253ms, CubicBezier: 182ms
Bezier: 231ms, CubicBezier: 174ms
Bezier: 228ms, CubicBezier: 173ms
Bezier: 230ms, CubicBezier: 185ms
Bezier: 226ms, CubicBezier: 160ms
Bezier: 234ms, CubicBezier: 171ms
Bezier: 234ms, CubicBezier: 170ms
Bezier: 228ms, CubicBezier: 183ms
Bezier: 223ms, CubicBezier: 168ms
Bezier: 221ms, CubicBezier: 165ms

min     221ms               160ms
max     253ms               185ms
avg     231ms               173ms

Edge:

Testing Bezier and CubicBezier 500.000 times in each cycle (one line)

Configuration:
  repetition: 10
  interRepetitionAlternation: 10
  stepsCycle: 1000
  stepsCount: 50

Bezier: 469ms, CubicBezier: 58ms
Bezier: 450ms, CubicBezier: 59ms
Bezier: 438ms, CubicBezier: 50ms
Bezier: 467ms, CubicBezier: 59ms
Bezier: 455ms, CubicBezier: 48ms
Bezier: 443ms, CubicBezier: 57ms
Bezier: 447ms, CubicBezier: 52ms
Bezier: 446ms, CubicBezier: 55ms
Bezier: 458ms, CubicBezier: 49ms
Bezier: 455ms, CubicBezier: 58ms

min     438ms               48ms
max     469ms               59ms
avg     453ms               55ms

Chrome:

Testing Bezier and CubicBezier 500.000 times in each cycle (one line)

Configuration:
  repetition: 10
  interRepetitionAlternation: 10
  stepsCycle: 1000
  stepsCount: 50

Bezier: 175ms, CubicBezier: 33ms
Bezier: 145ms, CubicBezier: 14ms
Bezier: 152ms, CubicBezier: 13ms
Bezier: 148ms, CubicBezier: 18ms
Bezier: 148ms, CubicBezier: 14ms
Bezier: 158ms, CubicBezier: 14ms
Bezier: 150ms, CubicBezier: 18ms
Bezier: 165ms, CubicBezier: 16ms
Bezier: 150ms, CubicBezier: 17ms
Bezier: 154ms, CubicBezier: 12ms

min     145ms               12ms
max     175ms               33ms
avg     155ms               17ms
*/