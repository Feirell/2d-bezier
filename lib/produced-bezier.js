import {
    bc,
    pow,
    sum,
    pointOn,
    levelReverse
} from './math-functions.js';

function produceSpecificAtFunction(points) {
    const grade = points.length - 1;
    let multiplier = "";

    let partXConst = "const partX = ";
    let partYConst = "const partY = ";

    for (let i = 0; i <= grade; i++) {
        const multiplierName = "m" + i;
        multiplier += "const  " + multiplierName + " = " + bc(grade, i) + (" * t".repeat(i)) + "" + (" * oneMinusT".repeat(grade - i)) + ";";

        partXConst += multiplierName + (i < grade ? " * " + points[i].x + " + " : "* " + points[i].x);
        partYConst += multiplierName + (i < grade ? " * " + points[i].y + " + " : "* " + points[i].y);
    }

    partXConst += ";";
    partYConst += ";";

    let prog = "const oneMinusT = 1 - t;const points = this.points;" + multiplier + partXConst + partYConst + "return {x : partX ,y : partY};";

    return new Function('t', prog);
}

const fCache = [];

function produceGeneralAtFunction(grade) {
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

    return fCache[grade] = new Function('t', prog);
}

function ProducedBezier(...points) {
    this.points = points;
    // this.at = produceGeneralAtFunction(points.length - 1).bind(this);
    this.at = produceSpecificAtFunction(this.points);
};

export {
    ProducedBezier
};