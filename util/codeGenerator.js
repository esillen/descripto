RandomUtils = require('./randomUtils');

CodeGenerator = {};

// Returns a string with three digits, "123" for example
CodeGenerator.generateRandomCode = function(maxNum) {
    console.log("GENERATING RANDOM 3-DIGIT CODE");
    var randomNumbers = []

    for(var i = 1; i < maxNum+1; i++) {
        randomNumbers.push(i); // generates numbers 1-4
    }
    RandomUtils.shuffle(randomNumbers); // randomizes the numbers
    var code = randomNumbers.slice(0, 3); // picks first three numbers
    return code.join(""); 
}

module.exports = CodeGenerator;
