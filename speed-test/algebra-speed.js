import {
    stringifySuite
} from "../node_modules/benchmark-suite-formatter/index-esm.js";

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

function inRange(is, should, margin) {
    const under = is <= (should + margin);
    const above = is >= (should - margin);
    return under && above ? 0 : (under ? -1 : 1);
}

// taken from https://en.wikipedia.org/wiki/Cubic_function#Algebraic_solution
function solveCubicFunc([a, b, c, d]) {
    const delta0 = b * b -
        3 * a * c;

    const delta1 = 2 * b * b * b -
        9 * a * b * c +
        27 * a * a * d;

    const delta = 18 * a * b * c * d -
        4 * b * b * b * d +
        b * b * c * c -
        4 * a * c * c * c -
        27 * a * a * d * d;

    console.log('delta', delta, 'delta0', delta0, 'delta1', delta1);

    const sign = 1;
    const C1 = Math.cbrt((delta1 + Math.sqrt(delta1 * delta1 - 4 * delta0 * delta0 * delta0)) / 2);
    const C2 = Math.cbrt((delta1 - Math.sqrt(delta1 * delta1 - 4 * delta0 * delta0 * delta0)) / 2);

    console.log('delta', delta, 'delta0', delta0, 'delta1', delta1, 'C1', C1, 'C2', C2);

    // if (inRange(delta, 0, 0.00001) == 0) {
    //     if (inRange(delta0, 0, 0.00001) == 0) {
    //         return [-b / (3 * a)];
    //     } else {
    //         return [(9 * a * d - b * c) / 2 * delta0, (4 * a * b * c - 9 * a * a * d - b * b * b) / (a * delta0)];
    //     }
    // }
}

function solveIWithDiscremenante(i, t) {
    const term = terms[i].splice(0);
    term[3] -= t;
    return solveCubicFunc(term);
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

const variantsToTest = [
    /*{
        name: "Algebra Solve",
        func: () => {
            test(solveIWithAlgebra)
            // try {
            // } catch (e) {
            //     console.error(e);
            // }
            // console.log('no error');
        }
    },*/
    {
        name: "Bin search (" + margin + ")",
        func: () => {
            return test(solveIWithBinary);
        }
    }, {
        name: "algebra with discriminant",
        func: () => {
            return test(solveCubicFunc);
        }
    }
];
// http://www.wolframalpha.com/input/?i=c%3D+cbrt(-127%2B+i*9*sqrt(591));+x%3D+-1%2F9+*(2%2Bc%2B40%2Fc)

const specialTerm = [3, 2, -4, -2]; // roots ca -1.3, -0.47, 1.1
console.log(solveCubicFunc(specialTerm));

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