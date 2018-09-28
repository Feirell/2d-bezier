// taken from: https://stackoverflow.com/a/3959275

const factorialCache = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000];

function factorial(n) {
    return factorialCache[n];
}

function reverseFactorial(n) {
    let f = 1;

    while (true)
        if (factorial(++f) >= n)
            return f - 1; // lower bound (f! which will fit in the given n, for upper bound just return f)

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
};

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
};

/**
 * Calculates the level of the given intermediate index of the given bezier grade.
 * 
 * Example:
 * 
 * i = 3, grade = 3
 * ```text
 *          level
 *  0 1 2   0
 *   3 4    1       <= the level of the given index 3
 *    5     2
 * ```
 * 
 * @param {number} bezierGrade 
 * @param {number} i 
 */
function level(bezierGrade, i) {
    return lvl(sum(bezierGrade + 1)) - lvl(sum(bezierGrade + 1) - i - 1) - 1;
};

/*
const grade = 4;
for (let a = 0; a < grade; a++) {
    let strNumbers = '';
    let strLevels = '';
    let strLevelsBottomUp = '';
    for (let b = sum(a); b < sum(a + 1); b++) {
        let o = sum(grade) - 1 - b;
        strNumbers += ' ' + o;
        strLevels += ' ' + levelReverse(grade - 1, o);
        strLevelsBottomUp += ' ' + level(grade - 1, o);
    }
    console.log(strNumbers.padEnd(20, ' ') + strLevels.padEnd(20, ' ') + strLevelsBottomUp);
}
*/

export {
    bc,
    factorial,
    reverseFactorial,
    sum,
    reverseSum,
    pointOn,
    pow,
    level,
    levelReverse
};