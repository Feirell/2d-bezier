import { stringifySuite } from "./result-formatter.js";

function bezier3rdDegreePoly(b0, b1, b2, b3) {
    return [
        -b0 + 3 * b1 - 3 * b2 + b3,
        3 * b0 - 6 * b1 + 3 * b2,
        -3 * b0 + 3 * b1,
        b0
    ];
}

const terms = new Array(40);
for (let i = 0; i < 40; i++)
    terms[i] = bezier3rdDegreePoly(0, Math.random(), Math.random(), 1);

const parsedTerms = terms.map(t => {
    const str = t[0] + " * t^3  " + (t[1] < 0 ? t[1] : "+" + t[1]) + " * t^2  " + (t[2] < 0 ? t[2] : "+" + t[2]) + " * t  " + (t[3] < 0 ? t[3] : "+" + t[3]);
    return algebra.parse(str);
});

const funcTerms = terms.map(t => new Function('t', "return " + t[0] + "*t*t*t+" + t[1] + "*t*t+" + t[2] + "*t+" + t[3] + ";"));

function inRange(should, is, margin) {
    const under = is <= (should + margin);
    const above = is >= (should - margin);
    return under && above ? 0 : (under ? -1 : 1);
}

function binSearch(func, should, margin) {
    // solution fraction
    let c = 1; // Denominator, with c / m is the current testing value

    let m = 2; // 1/m is the current shift in each cycle

    let d;
    let i = 1;
    while ((d = inRange(func(c / m), should, margin)) != 0) {
        c = (c << 1) + d;

        if (m > 0 && (m << 1) < 0)
            throw new Error('could not find the gived value');
        i++;
        m = m << 1;
    }

    return c / m;
}

const margin = 1e-4;

function solveIWithAlgebra(i, x) {
    return new algebra.Equation(parsedTerms[i], 2231).solveFor("t")[0];
}

function solveIWithBinary(i, x) {
    return binSearch(funcTerms[i], x, margin);
}

function test(func) {
    return func(Math.floor(Math.random() * 40), Math.random());
}

test(solveIWithAlgebra);

const variantsToTest = [{
    name: "Algebra Solve",
    func: () => {
        test(solveIWithAlgebra)
        // try {
        // } catch (e) {
        //     console.error(e);
        // }
        // console.log('no error');
    }
}, {
    name: "Bin search (" + margin + ")",
    func: () => {
        test(solveIWithBinary)
    }
}];

function printStatus() {
    output.innerText = platform.name + " (" + platform.version + ") on " + platform.os +
        "\n\n" + stringifySuite(testSuite)
}

function testSubjects(subjects) {
    const suite = new Benchmark.Suite;

    for (let variant of subjects)
        suite.add(variant.name, variant.func);

    suite.on('cycle', function (event) {
        printStatus(suite);
    });

    return suite;
}

let output, testSuite, createSuite;
document.addEventListener('DOMContentLoaded', function () {
    output = document.getElementById('output');
    testSuite = testSubjects(variantsToTest);

    testSuite.run({
        'async': true
    });

    testSuite.on('complete', function () {
        console.log('finished');
    })

    printStatus();
});