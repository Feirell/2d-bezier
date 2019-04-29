function fileExists(path) {
    try {
        fs.statSync(path);
    } catch (e) {
        return false;
    }
    return true;
}

function getSamples(chancesForZeros, amount, genNew) {
    genNew = !!genNew;
    let fileName = 'random-' + amount + '-' + chancesForZeros[0] + '-' + chancesForZeros[1] + '-' + chancesForZeros[2] + '-' + chancesForZeros[3] + '.samples.json';
    if (!genNew && fileExists('./' + fileName))
        return JSON.parse(fs.readFileSync(fileName, 'utf-8'));

    const samples = new Array(amount);
    for (let i = 0; i < amount; i++)
        samples[i] = generateEdegeCaseBezier(chancesForZeros);


    fs.writeFileSync('./' + fileName, JSON.stringify(samples, null, ' '), 'utf-8');

    return samples;
}

module.exports.getSamples = getSamples;