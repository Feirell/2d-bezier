import {
    Bezier,
    CubicBezier
} from '../index.js';

import {
    Bezier as TypedBezier
} from '../lib-type-check/bezier.js';

import {
    CubicBezier as TypedCubicBezier
} from '../lib-type-check/cubic-bezier.js';

import {
    test
} from './speed-test-util.js';

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
const bezierForIntermediate = new Bezier(pa, pb, pc, pd);
// you can use any instance, as long as the instance has an at methode which expects a float value as its first argument
const variantsToTest = [{
        name: "Bezier",
        instance: new Bezier(pa, pb, pc, pd)
    }, {
        name: "CubicBezier",
        instance: new CubicBezier(pa, pb, pc, pd)
    }, {
        name: "TypedBezier",
        instance: new TypedBezier(pa, pb, pc, pd)
    }, {
        name: "TypedCubicBezier",
        instance: new TypedCubicBezier(pa, pb, pc, pd)
    },
    {
        name: "Bezier w/ intermediate",
        instance: {
            at: n => bezierForIntermediate.atWithIntermidiate(n).pop()
        }
    }
];

for (let variant of variantsToTest) {
    const calcedPoint = variant.instance.at(0.3);
    if (Math.abs(0.2412 - calcedPoint.x) > 0.000001 || Math.abs(0.342 - calcedPoint.y) > 0.000001)
        throw new Error('variant "' + variant.name + '" did not returned an accaptable result for the test calculation, correct would be x: 0.2412 and y: 0.342 but returned x: ' + calcedPoint.x + ' and y: ' + calcedPoint.y);
}

const iterations = {
    repetition: 10,
    interReAlt: 10,
    stepsCycle: 50,
    stepsCount: 500,
}

document.addEventListener('DOMContentLoaded', function () {
    const output = document.getElementById('output');

    const testResult = test(variantsToTest, iterations);
    output.innerText = testResult;
});