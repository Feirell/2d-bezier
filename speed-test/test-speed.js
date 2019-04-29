const fs = require('fs');
const Benchmark = require("benchmark");
const RFormatter = require("benchmark-suite-formatter");

const bezier = require("./index-cjs.js");
const {
    perfTest
} = require('./perf-utils.js');

const samples = getSamples([0.15, 0.1, 0.1, 0.35], 100);

const test = perfTest(
    samples,
    solveCube,
    // solveCubeAlgebraJS,
    solveCubeMathJS,
);

test.then(
    ev => {
        // console.log('finished');
    },
    ev => {
        if (ev.target)
            console.error(ev.target.name + ' threw an error\n' + ev.target.error);
        else
            console.error('error in suite\n%o', ev);
    }
)