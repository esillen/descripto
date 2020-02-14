var mongoClient = require('./mongoClient');
var teams = require('./teams')
var COLLECTION_NAME = "Games";
games = {};

games.startNewGame = function(team1Players, team2Players) {
    var team1 = teams.createNewTeam(team1Players);
    var team2 = teams.createNewTeam(team2Players);
    var newGame = {
        team1: team1,
        team2: team2
    };
    mongoClient.insertOne(COLLECTION_NAME, newGame);
}

games.getAll = function(callback) {
    mongoClient.getAll(COLLECTION_NAME, (allGames) => {
        callback(allGames);
    });
}

module.exports = words;
