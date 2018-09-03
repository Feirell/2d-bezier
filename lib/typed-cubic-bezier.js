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
}

export {
    TypedCubicBezier
};