import {
    bc,
    pow,
    sum,
    pointOn,
    levelReverse
} from './math-functions.js';


function TypedBezier(points) {
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
    })


    Object.defineProperties(this, {
        points: {
            value: Object.freeze(points)
        },
        grade: {
            value: points.length - 1
        }
    })

};

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
        const currentMultiplier = bc(grade, i) * pow(t, i) * pow(oneMinusT, grade - i)
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

export {
    TypedBezier
};