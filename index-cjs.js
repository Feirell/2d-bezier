'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// taken from: https://stackoverflow.com/a/3959275

const factorialCache = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000];

function factorial(n) {
    return factorialCache[n];
}

const bcCache = [];

// binomial coefficient
function bc(n, k) {

    if (k > n / 2)
        k = n - k;

    if (k == 0)
        return 1;

    if (k == 1)
        return n;

    return bcCache[n][k];
}

// building up cache 
for (let n = 0; n <= 15; n++) {
    bcCache[n] = [];
    for (let k = 0; k <= Math.ceil(n / 2); k++) {
        bcCache[n][k] = factorial(n) / (factorial(k) * factorial(n - k));
    }
}

function sum(n) {
    return n * (n + 1) / 2
}

function reverseSum(k) {
    return Math.sqrt(2 * k + 0.25) - 0.5
}

function pointOn(t, a, b) {
    return {
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y)
    }
}

const pow = (n, k) => Math.pow(n, k);

function lvl(i) {
    return Math.floor(reverseSum(i));
}
/**
 * Calculates the level of the given intermediate index of the given bezier grade.
 * 
 * Example:
 * 
 * i = 3, grade = 3
 * ```text
 *          level
 *  0 1 2   2
 *   3 4    1       <= the level of the given index 3
 *    5     0
 * ```
 * 
 * @param {number} bezierGrade 
 * @param {number} i 
 */
function levelReverse(bezierGrade, i) {
    return lvl(sum(bezierGrade + 1) - i - 1);
}

function Bezier(...points) {
    this.points = points;
}
Bezier.prototype.at = function at(t) {
    const oneMinusT = 1 - t;
    const points = this.points;
    const grade = points.length - 1;

    let partX = 0;
    let partY = 0;

    for (let i = 0; i <= grade; i++) {
        const currentMultiplier = bc(grade, i) * pow(t, i) * pow(oneMinusT, grade - i);
        const point = points[i];

        partX += currentMultiplier * point.x;
        partY += currentMultiplier * point.y;
    }

    return {
        x: partX,
        y: partY
    };
};

Bezier.prototype.atWithIntermidiate = function atWithIntermidiate(t) {
    const points = this.points.slice(0);

    const length = points.length;
    const grade = length - 1;

    const amountOfNodes = sum(length);
    for (let i = length; i < amountOfNodes; i++) {
        const a = i - levelReverse(grade, i) - 2;
        const b = a + 1;

        points[i] = pointOn(t, points[a], points[b]);
    }

    return points;
};

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

function ProducedBezier(...points) {
    this.points = points;
    // this.at = produceGeneralAtFunction(points.length - 1).bind(this);
    this.at = produceSpecificAtFunction(this.points);
}

function CubicBezier(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
}

CubicBezier.prototype.at = function at(t) {
    const oneMinusT = 1 - t;

    const partX = oneMinusT * oneMinusT * oneMinusT * this.a.x +
        3 * t * oneMinusT * oneMinusT * this.b.x +
        3 * t * t * oneMinusT * this.c.x +
        t * t * t * this.d.x;

    const partY = oneMinusT * oneMinusT * oneMinusT * this.a.y +
        3 * t * oneMinusT * oneMinusT * this.b.y +
        3 * t * t * oneMinusT * this.c.y +
        t * t * t * this.d.y;

    return {
        x: partX,
        y: partY
    };
};

function TypedBezier(...points) {
    points = (points[0] instanceof Array) ?
        points[0] :
        Array.prototype.slice.call(points);

    points.map(point => {
        point = Object.freeze({
            x: parseFloat(point.x),
            y: parseFloat(point.y)
        });

        if (!isFinite(point.x))
            throw new Error('point.x was not finite for parameter ' + point + ' was ' + i + ' argument');

        if (!isFinite(point.y))
            throw new Error('point.y was not finite for parameter ' + point + ' was ' + i + ' argument');

        return point;
    });


    Object.defineProperties(this, {
        points: {
            value: Object.freeze(points)
        },
        grade: {
            value: points.length - 1
        }
    });

}
TypedBezier.prototype.at = function at(t) {
    t = parseFloat(t);

    if (!isFinite(t))
        throw new Error('parameter t for Bezier.at was not a number');

    if (t < 0)
        throw new Error('parameter t for Bezier.at was less than zero ' + t);

    if (t > 1)
        throw new Error('parameter t for Bezier.at was greater than one ' + t);

    const oneMinusT = 1 - t;
    const grade = this.grade;
    const points = this.points;

    let partX = 0;
    let partY = 0;

    for (let i = 0; i <= grade; i++) {
        const currentMultiplier = bc(grade, i) * pow(t, i) * pow(oneMinusT, grade - i);
        const point = points[i];

        partX += currentMultiplier * point.x;
        partY += currentMultiplier * point.y;
    }

    return {
        x: partX,
        y: partY
    };
};

TypedBezier.prototype.atWithIntermidiate = function atWithIntermidiate(t) {
    const points = this.points.slice(0);

    const amountOfNodes = sum(this.grade + 1);
    for (let i = this.grade + 1; i < amountOfNodes; i++) {
        const a = i - levelReverse(this.grade, i) - 2;
        const b = a + 1;

        points[i] = pointOn(t, points[a], points[b]);
    }

    return points;
};

function TypedCubicBezier(a, b, c, d) {
    this.a = {
        x: parseFloat(a.x),
        y: parseFloat(a.y)
    };

    this.b = {
        x: parseFloat(b.x),
        y: parseFloat(b.y)
    };

    this.c = {
        x: parseFloat(c.x),
        y: parseFloat(c.y)
    };

    this.d = {
        x: parseFloat(d.x),
        y: parseFloat(d.y)
    };

}

TypedCubicBezier.prototype.at = function at(t) {
    t = parseFloat(t);

    if (!isFinite(t))
        throw new Error('parameter t for CubicBezier.at was not a number');

    if (t < 0)
        throw new Error('parameter t for CubicBezier.at was less than zero ' + t);

    if (t > 1)
        throw new Error('parameter t for CubicBezier.at was greater than one ' + t);

    const oneMinusT = 1 - t;

    const partX = oneMinusT * oneMinusT * oneMinusT * this.a.x +
        3 * t * oneMinusT * oneMinusT * this.b.x +
        3 * t * t * oneMinusT * this.c.x +
        t * t * t * this.d.x;

    const partY = oneMinusT * oneMinusT * oneMinusT * this.a.y +
        3 * t * oneMinusT * oneMinusT * this.b.y +
        3 * t * t * oneMinusT * this.c.y +
        t * t * t * this.d.y;

    return {
        x: partX,
        y: partY
    };
};

exports.Bezier = Bezier;
exports.ProducedBezier = ProducedBezier;
exports.CubicBezier = CubicBezier;
exports.TypedBezier = TypedBezier;
exports.TypedCubicBezier = TypedCubicBezier;
