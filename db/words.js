var mongoClient = require('./mongoClient');
var COLLECTION_NAME = "Words";
words = {};

words.addWord = function(word) {
    mongoClient.insertOne(COLLECTION_NAME, word);
}

words.getAllWords = function(callback) {
    mongoClient.getAll(COLLECTION_NAME, (allWords) => {
        callback(allWords);
    });
}

module.exports = words;
