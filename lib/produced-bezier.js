import {
    bc,
    pow,
    sum,
    pointOn,
    levelReverse
} from './math-functions.js';

const fCache = [];

function produceAtFunction(grade) {
    if (typeof fCache[grade] == 'function')
        return fCache[grade];

    let multiplier = "";

    let partXConst = "const partX = ";
    let partYConst = "const partY = ";

    for (let i = 0; i <= grade; i++) {
        const multiplierName = "m" + i;
        multiplier += "const  " + multiplierName + " = " + bc(grade, i) + (" * t".repeat(i)) + "" + (" * oneMinusT".repeat(grade - i)) + ";";

        partXConst += multiplierName + (i < grade ? " * points[" + i + "].x + " : "* points[" + i + "].x");
        partYConst += multiplierName + (i < grade ? " * points[" + i + "].y + " : "* points[" + i + "].y");
    }

    partXConst += ";";
    partYConst += ";";

    let prog = "const oneMinusT = 1 - t;const points = this.points;" + multiplier + partXConst + partYConst + "return {x : partX ,y : partY};";
    console.log('prog', prog);
    return fCache[grade] = new Function('t', prog);
}

function ProducedBezier(...points) {
    this.points = points;
    this.at = produceAtFunction(points.length - 1).bind(this);
};

export {
    ProducedBezier
};