function TypedCubicBezier(points) {
    this.a = {
        x: parseFloat(points[0].x),
        y: parseFloat(points[0].y)
    };

    this.b = {
        x: parseFloat(points[1].x),
        y: parseFloat(points[1].y)
    };

    this.c = {
        x: parseFloat(points[2].x),
        y: parseFloat(points[2].y)
    };

    this.d = {
        x: parseFloat(points[3].x),
        y: parseFloat(points[3].y)
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
}

export {
    TypedCubicBezier
};