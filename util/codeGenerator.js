RandomUtils = require('./randomUtils');

CodeGenerator = {};

CodeGenerator.generateRandomCode = function(maxNum) {
    console.log("GENERATING RANDOM 3-DIGIT CODE");
    var randomNumbers = []

    for(var i = 0; i < maxNum; i++) {
        randomNumbers.push(i); // generates numbers 1-4 inclusive
    }
    RandomUtils.shuffle(randomNumbers);
    var code = randomNumbers.slice(0, 3);
    return code;
}

module.exports = CodeGenerator;
