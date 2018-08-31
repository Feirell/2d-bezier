import {
    Bezier,
    CubicBezier
} from './index.js';
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
});