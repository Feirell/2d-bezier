function testInstance(bezier, ite) {
    const start = Date.now();

    for (let i = 0; i < ite.stepsCycle; i++)
        for (let n = 0; n <= ite.stepsCount; n++)
            bezier.at(n / ite.stepsCount);

    const end = Date.now();

    return end - start;
}

const formatNumber = (v, extend) => {
    let frm = v.toLocaleString(undefined, {});
    if (extend > frm.length)
        frm = frm.padStart(extend, ' ');

    return frm;
};

function produceOutput(variants, ite) {

    for (let v = 0; v < variants.length; v++) {
        const variant = variants[v];

        variant.sum = variant.cycleTime.reduce((a, v) => a + v);
        variant.sorted = variant.cycleTime.slice().sort((a, b) => a - b);
        variant.greatest = variant.sorted[variant.sorted.length - 1];
        variant.lowest = variant.sorted[0];
        variant.avarage = variant.sum / variant.cycleTime.length;

        variant.longestString = formatNumber(variant.greatest).length;
    }

    let completeString = "Testing ";

    for (let v = 0; v < variants.length; v++) {
        completeString += variants[v].name;
        if (v != variants.length - 1)
            if (v == variants.length - 2)
                completeString += ' and ';
            else
                completeString += ', ';
    }

    completeString += " " + formatNumber(ite.interReAlt * ite.stepsCycle * ite.stepsCount) + " times in each cycle (one line)\n\n";

    completeString += "Configuration:\n";
    completeString += "  repetition: " + ite.repetition + "\n";
    completeString += "  interReAlt: " + ite.interReAlt + "\n";

    completeString += "  stepsCycle: " + ite.stepsCycle + "\n";
    completeString += "  stepsCount: " + ite.stepsCount + "\n\n";

    for (let c = 0; c < ite.repetition; c++) {
        for (let v = 0; v < variants.length; v++) {
            const variant = variants[v];

            completeString += variant.name + ": " + formatNumber(variant.cycleTime[c], variant.longestString) + "ms" + ((v == variants.length - 1) ? '\n' : ', ');
        }
    }

    completeString += '\nmin';
    for (let v = 0; v < variants.length; v++) {
        const variant = variants[v];

        completeString += ' '.repeat(variant.name.length + ((v == 0) ? -1 : 2)) + formatNumber(Math.round(variant.lowest), variant.longestString) + "ms" + ((v == variants.length - 1) ? '\n' : '  ');
    }

    completeString += 'max';
    for (let v = 0; v < variants.length; v++) {
        const variant = variants[v];

        completeString += ' '.repeat(variant.name.length + ((v == 0) ? -1 : 2)) + formatNumber(Math.round(variant.greatest), variant.longestString) + "ms" + ((v == variants.length - 1) ? '\n' : '  ');
    }

    completeString += 'avg';
    for (let v = 0; v < variants.length; v++) {
        const variant = variants[v];

        completeString += ' '.repeat(variant.name.length + ((v == 0) ? -1 : 2)) + formatNumber(Math.round(variant.avarage), variant.longestString) + "ms" + ((v == variants.length - 1) ? '' : '  ');
    }

    return completeString;
}

function testAllInstances(variantsToTest, ite) {

    for (let v = 0; v < variantsToTest.length; v++)
        variantsToTest[v].cycleTime = [];

    for (let k = 0; k < ite.repetition; k++) {
        for (let v = 0; v < variantsToTest.length; v++)
            variantsToTest[v].cycleTime[k] = 0;

        for (let i = 0; i < ite.interReAlt; i++)
            for (let v = 0; v < variantsToTest.length; v++)
                variantsToTest[v].cycleTime[k] += testInstance(variantsToTest[v].instance, ite);
    }

}

function test(variantsToTest, iterations) {
    const ite = {
        repetition: isFinite(iterations.repetition) && iterations.repetition > 0 ? 0 + iterations.repetition : 10,
        interReAlt: isFinite(iterations.interReAlt) && iterations.interReAlt > 0 ? 0 + iterations.interReAlt : 10,
        stepsCycle: isFinite(iterations.stepsCycle) && iterations.stepsCycle > 0 ? 0 + iterations.stepsCycle : 1000,
        stepsCount: isFinite(iterations.stepsCount) && iterations.stepsCount > 0 ? 0 + iterations.stepsCount : 50
    };

    testAllInstances(variantsToTest, ite);
    return produceOutput(variantsToTest, ite);
}

export {
    test
};