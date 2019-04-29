function printStatus(suite) {
    console.clear();
    console.log('perf test\n\n' + RFormatter.stringifySuite(suite));
}

function chooseRandom(arr) {
    return arr[(arr.length * Math.random()) >> 0];
}

function perfTest(multiplier, ...functions) {
    return new Promise(function (res, rej) {
        const suite = new Benchmark.Suite;

        for (let func of functions) {
            const name = func.printName || func.name;

            suite.add(name, function () {
                func(chooseRandom(multiplier));
            })
        }

        suite.on('error', function (event) {
            suite.abort();
            rej(suite, event);
        })

        suite.on('cycle', function (event) {
            if (!suite.aborted)
                printStatus(suite);
        });

        suite.on('complete', function (event) {
            res(suite, event);
        });

        suite.run({
            'async': true
        });

        printStatus(suite);
    })
}

exports.perfTest = perfTest;