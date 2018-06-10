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

        function calcLevel(bezierGrade, i) {
            return Math.floor(reverseSum(sum(bezierGrade + 1) - i));
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

    function Bezier() {

        const points = [];

        for (let i = 0; i < arguments.length; i++) {
            const current = arguments[i];

            const point = points[i] = Object.freeze({
                x: parseFloat(current.x),
                y: parseFloat(current.y)
            })

            if (!isFinite(point.x))
                throw new Error('point.x was not finite for parameter ' + point + ' was ' + i + ' argument');

            if (!isFinite(point.y))
                throw new Error('point.y was not finite for parameter ' + point + ' was ' + i + ' argument');
        }

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
        // const point = this.at(t);
        const intermediates = [].concat(this.points);

        const pointsLength = this.points.length;
        let offset = 0;

        const pointOn = (t, a, b) => ({
            x: a.x + t * (b.x - a.x),
            y: a.y + t * (b.y - a.y)
        });

        for (let start = this.grade + 1; start >= 0; start--) {
            for (let currentStart = offset; currentStart < offset + start; currentStart++) {
                intermediates[intermediates.length] = pointOn(t, intermediates[currentStart], intermediates[currentStart + 1]);
            }
            offset += start;
        }


        return {
            point: point,
            intermediates: intermediates
        }
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