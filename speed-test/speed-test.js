import {
    Bezier,
    ProducedSpezificBezier,
    ProducedGeneralBezier,
    CubicBezier
} from '../index.js';

import {
    stringifySuite
} from './result-formatter.js';

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

const points = [pa, pb, pc, pd];

// you can use any instance, as long as the instance has an at methode which expects a float value as its first argument
const variantsToCreate = [{
    name: "Bezier",
    instance: () => {
        new Bezier(points);
    }
}, {
    name: "ProducedSpezificBezier",
    instance: () => {
        new ProducedSpezificBezier(points);
    }
}, {
    name: "ProducedGeneralBezier",
    instance: () => {
        new ProducedGeneralBezier(points);
    }
}, {
    name: "CubicBezier",
    instance: () => {
        new CubicBezier(points);
    }
}];

const bezierForIntermediate = new Bezier(points);
// you can use any instance, as long as the instance has an at methode which expects a float value as its first argument
const variantsToTest = [{
    name: "Bezier",
    instance: new Bezier(points)
}, {
    name: "ProducedSpezificBezier",
    instance: new ProducedSpezificBezier(points)
}, {
    name: "ProducedGeneralBezier",
    instance: new ProducedGeneralBezier(points)
}, {
    name: "CubicBezier",
    instance: new CubicBezier(points)
}, {
    name: "Bezier w/ intermediate",
    instance: {
        at: n => bezierForIntermediate.atWithIntermidiate(n).pop()
    }
}];

for (let variant of variantsToTest) {
    const calcedPoint = variant.instance.at(0.3);
    if (Math.abs(0.2412 - calcedPoint.x) > 0.000001 || Math.abs(0.342 - calcedPoint.y) > 0.000001)
        throw new Error('variant "' + variant.name + '" did not returned an accaptable result for the test calculation, correct would be x: 0.2412 and y: 0.342 but returned x: ' + calcedPoint.x + ' and y: ' + calcedPoint.y);
}

function printStatus() {
    output.innerText = platform.name + " (" + platform.version + ") on " + platform.os +
        "\n\nCreation Timing\n" + stringifySuite(createSuite) +
        "\n\nAt Timing\n" + stringifySuite(testSuite);
}

function testSubjects(subjects) {
    const suite = new Benchmark.Suite;

    for (let variant of subjects)
        suite.add(variant.name, variant.instance.at ?
            variant.instance.at.bind(variant.instance, 0.3) :
            variant.instance);

    suite.on('cycle', function (event) {
        printStatus(suite);
    });

    return suite;
}

let output, testSuite, createSuite;
document.addEventListener('DOMContentLoaded', function () {
    output = document.getElementById('output');
    testSuite = testSubjects(variantsToTest);
    createSuite = testSubjects(variantsToCreate);

    createSuite.on('complete', function () {
        testSuite.run({
            'async': true
        });
        printStatus();
    });

    createSuite.run({
        'async': true
    });
    printStatus();


});