(function () {

    // taken from: https://stackoverflow.com/a/3959275
    {
        const cache = [1, 1];
        let i = 2;

        function factorial(n) {
            if (!isFinite(n = parseInt(n)) || n < 0)
                throw new Error('argument for factorial has to be a positive finite integer but was ' + n);

            for (; i <= n; i++)
                cache[i] = cache[i - 1] * i;

            return cache[n];
        }

        function reverseFactorial(n) {
            if (!isFinite(n = parseFloat(n)) || n < 0)
                throw new Error('argument for reverseFactorial has to be a positive finite floatingpoint number but was ' + n);

            let f = 1;

            while (true)
                if (factorial(++f) >= n)
                    return f - 1; // lower bound (f! which will fit in the given n, for upper bound just return f)

        }
    }

    {
        function sum(n) {
            return n * (n + 1) / 2
        }

        function reverseSum(k) {
            return Math.sqrt(2 * k + 0.25) - 0.5
        }

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
        }

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

        window.util = {
            sum: sum,
            reverseSum: reverseSum,
            level: level,
            levelReverse
        }
    }

    {
        function pointOn(t, a, b) {
            return {
                x: a.x + t * (b.x - a.x),
                y: a.y + t * (b.y - a.y)
            }
        }
    }

    {
        const cache = [];
        // binomial coefficient
        function bc(n, k) {
            // dropping checks for type and range to increase performance

            if (k > n / 2)
                k = n - k;

            if (k == 0)
                return 1;

            if (k == 1)
                return n;

            if (cache[n] == undefined)
                cache[n] = [];

            if (cache[n][k] == undefined)
                return cache[n][k] = factorial(n) / (factorial(k) * factorial(n - k));

            return cache[n][k];
        }

        // building up cache 
        for (let n = 0; n <= 10; n++)
            for (let k = 2; k <= Math.ceil(n / 2); k++)
                bc(n, k)
    }

    const pow = Math.pow.bind(Math);

    function Bezier(...points) {
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
        })


        Object.defineProperties(this, {
            points: {
                value: Object.freeze(points)
            },
            grade: {
                value: points.length - 1
            }
        })

    }

    Bezier.prototype.at = function at(t) {
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
    }

    Bezier.prototype.atWithIntermidiate = function atWithIntermidiate(t) {
        const points = this.points.slice();

        for (let i = this.grade + 1; i < sum(this.grade + 1); i++) {
            const a = i - levelReverse(this.grade, i) - 2;
            const b = a + 1;

            points[i] = pointOn(t, points[a], points[b]);
        }

        return points;
    }

    function CubicBezier(a, b, c, d) {
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

    CubicBezier.prototype.at = function at(t) {
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

    window.Bezier = Bezier;
    window.CubicBezier = CubicBezier;
})()