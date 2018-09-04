import {
    Bezier,
    CubicBezier,
    TypedBezier,
    TypedCubicBezier
} from '../index.js';

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
let maxLengthOfName = 0;
for (let variant of variantsToTest) {
    const calcedPoint = variant.instance.at(0.3);
    if (Math.abs(0.2412 - calcedPoint.x) > 0.000001 || Math.abs(0.342 - calcedPoint.y) > 0.000001)
        throw new Error('variant "' + variant.name + '" did not returned an accaptable result for the test calculation, correct would be x: 0.2412 and y: 0.342 but returned x: ' + calcedPoint.x + ' and y: ' + calcedPoint.y);

    let length = variant.name.length;
    if (length > maxLengthOfName)
        maxLengthOfName = length;
}

document.addEventListener('DOMContentLoaded', function () {
    const output = document.getElementById('output');
    let firstOutput = true;
    const suite = new Benchmark.Suite;

    for (let variant of variantsToTest)
        suite.add(variant.name, variant.instance.at.bind(variant.instance, 0.3));

    suite.on('cycle', function (event) {
        if (firstOutput) {
            firstOutput = false;
            output.innerText = platform.name + " (" + platform.version + ") on " + platform.os + "\n\n";
        }

        // output.innerText += " ".repeat(maxLengthOfName - event.target.name.length) + String(event.target) + "\n";
        output.innerText += String(event.target) + "\n";
    });

    suite.on('complete', function () {
        // console.log('Fastest is ' + this.filter('fastest').map('name'));
        output.innerText += "\nTest finished";
    });

    output.innerText = "Testing ...";
    suite.run({
        'async': true
    });
});