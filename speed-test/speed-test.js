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

for (let variant of variantsToTest) {
    const calcedPoint = variant.instance.at(0.3);
    if (Math.abs(0.2412 - calcedPoint.x) > 0.000001 || Math.abs(0.342 - calcedPoint.y) > 0.000001)
        throw new Error('variant "' + variant.name + '" did not returned an accaptable result for the test calculation, correct would be x: 0.2412 and y: 0.342 but returned x: ' + calcedPoint.x + ' and y: ' + calcedPoint.y);
}

function createTableLikeOutput(columnNames, rows) {
    const maxSizeColumns = columnNames.map(n => n.length);
    const columns = columnNames.length;

    for (let r = 0; r < rows.length; r++) {
        const row = rows[r];

        if (columns < row.length)
            throw new Error("row " + r + " has more columns than defined in columnNames");

        for (let c = 0; c < columns; c++)
            if (maxSizeColumns[c] < row[c].length)
                maxSizeColumns[c] = row[c].length;
    }



    let str = "";
    for (let c = 0; c < columns; c++) {
        str += columnNames[c].padStart(maxSizeColumns[c], ' ');

        if (c != columns - 1)
            str += " ";
    }

    str += '\n';

    for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        for (let c = 0; c < columns; c++) {
            str += row[c].padStart(maxSizeColumns[c], ' ');
            if (c != columns - 1)
                str += " ";
        }

        if (r != rows.length - 1)
            str += '\n';
    }

    return str;
}

const integerFormatter = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const floatFormatter = Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

function formatNumber(integer, number) {
    if (number == 0)
        return '';

    return (integer ? integerFormatter : floatFormatter).format(number);
}

function printStatus(suite) {
    output.innerText = platform.name + " (" + platform.version + ") on " + platform.os + "\n\n" +
        createTableLikeOutput(['name', 'ops/sec', 'variance', 'samples'], suite.map(
            benchmark => [
                '' + benchmark.name,
                '' + formatNumber(true, benchmark.hz),
                '' + formatNumber(false, benchmark.stats.rme),
                '' + formatNumber(true, benchmark.stats.sample.length)
            ]
        ))
}

document.addEventListener('DOMContentLoaded', function () {
    const output = document.getElementById('output');
    const suite = window.suite = new Benchmark.Suite;

    for (let variant of variantsToTest)
        suite.add(variant.name, variant.instance.at.bind(variant.instance, 0.3));

    suite.on('cycle', function (event) {
        printStatus(suite);
    });

    suite.on('complete', function () { });

    suite.run({
        'async': true
    });


    printStatus(suite);
});