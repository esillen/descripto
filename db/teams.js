var mongoClient = require('./mongoClient');
var COLLECTION_NAME = "Teams";
teams = {};

teams.addWord = function(word) {
    mongoClient.insertOne(COLLECTION_NAME, word);
}

teams.createNewTeam = function(players) {
    
}

teams.getAll = function(callback) {
    mongoClient.getAll(COLLECTION_NAME, (allTeams) => {
        callback(allTeams);
    });
}

module.exports = words;
