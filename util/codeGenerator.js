codeGenerator = {};

codeGenerator.generateRandomCode = function(callback) {
    console.log("GENERATING RANDOM 3-DIGIT NUMBER");
    var randomNumbers = []
    for(var i = 0; i < 3; i++) {
        randomNumbers.push(Math.ceil(Math.random() * 4)); // generates numbers 1-4 inclusive
    }
    var code = randomNumbers.join(".");
    callback(code);
}

module.exports = codeGenerator;
