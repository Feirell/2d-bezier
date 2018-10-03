import {
    bc,
    pow,
    sum,
    pointOn,
    levelReverse
} from './math-functions.js';

const useStrict = '"use strict";';

function produceSpecificAtFunction(points) {
    const grade = points.length - 1;
    let multiplier = "";

    let partXConst = "const partX = ";
    let partYConst = "const partY = ";

    for (let i = 0; i <= grade; i++) {
        const point = points[i];

        const multiplierName = "m" + i;
        multiplier += "const  " + multiplierName + " = " + bc(grade, i) + (" * t".repeat(i)) + "" + (" * oneMinusT".repeat(grade - i)) + ";";

        partXConst += multiplierName + (i < grade ? " * " + point.x + " + " : "* " + point.x);
        partYConst += multiplierName + (i < grade ? " * " + point.y + " + " : "* " + point.y);
    }

    partXConst += ";";
    partYConst += ";";

    const prog = "const oneMinusT = 1 - t;" + multiplier + partXConst + partYConst + "return {x : partX ,y : partY};";
    return new Function('t', prog);
}

function ProducedSpezificBezier(points) {
    this.at = produceSpecificAtFunction(points);
};

const fCache = [];

function produceGeneralAtFunction(grade) {
    if (fCache[grade] != undefined)
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

    let prog = "const oneMinusT = 1 - t;" + multiplier + partXConst + partYConst + "return {x : partX ,y : partY};";

    return fCache[grade] = new Function('t', 'points', prog);
}

function ProducedGeneralBezier(points) {
    this.points = points;
    this.grade = points.length - 1;

    produceGeneralAtFunction(this.grade);
}

ProducedGeneralBezier.prototype.at = function at(t) {
    return fCache[this.grade](t, this.points);
}

export {
    ProducedSpezificBezier,
    ProducedGeneralBezier
};