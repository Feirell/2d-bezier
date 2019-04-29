function bezier3rdDegreePoly(b0, b1, b2, b3) {
    return [
        -b0 + 3 * b1 - 3 * b2 + b3,
        3 * b0 - 6 * b1 + 3 * b2,
        -3 * b0 + 3 * b1,
        b0
    ];
}

function generateRandomInterpolationBezier() {
    return bezier3rdDegreePoly(0, Math.random(), Math.random(), 1);
}

function generateRandomBezier() {
    return bezier3rdDegreePoly(Math.random(), Math.random(), Math.random(), Math.random());
}

function rnd() {
    return Math.random();
}

function generateEdegeCaseBezier(chancesForZero) {
    const a = rnd() < chancesForZero[0] ? 0 : rnd();
    const b = rnd() < chancesForZero[1] ? 0 : rnd();
    const c = rnd() < chancesForZero[2] ? 0 : rnd();
    const d = rnd() < chancesForZero[3] ? 0 : rnd();

    return [a, b, c, d];
}

module.exports = {
    generateRandomBezier,
    generateEdegeCaseBezier,
    generateRandomInterpolationBezier
};