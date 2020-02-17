var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");
var CodeGenerator = require("../util/codeGenerator");
var Validator = require("../util/validator");
var Team = require('./team');
var GameLog = require('./gameLog');


var COLLECTION_NAME = "Games";

var Game = function(data) {
  this.data = data;
};

Game.prototype.data = {};

Game.prototype.sanitize = function(data) {
  data = data || {};
  schema = schemas.game;
  return _.pick(_.defaults(data, schema), _.keys(schema));
};

// Returns the id of the newly created game
Game.createNew = function(teamIds, logIds) {
  return new Promise((resolve, reject) => {
    var gameData = {};
    gameData.teams = teamIds;
    gameData.teamLogs = logIds;
    gameData.turn = 1;
    gameData.teamCodes = [];
    gameData.teams.forEach(team => {
      gameData.teamCodes.push(CodeGenerator.generateRandomCode());
    });
    var newGame = new Game(gameData);
    newGame.save().then(storeGameData => {
      resolve(storeGameData._id.toString());
    });
  });
}

Game.findById = function(id) {
  return new Promise((resolve, reject) => {
    mongoClient.findById(COLLECTION_NAME, id).then(gameData => {
      resolve(new Game(gameData.data));
    });
  });
};

Game.getAll = function() {
  return new Promise((resolve, reject) => {
    mongoClient.getAll(COLLECTION_NAME).then(gamesDatas => {
      var games = [];
      console.log(gamesDatas);
      gamesDatas.forEach(gameData => {
        games.push(new Game(gameData));
      });
      resolve(games);
    });
  });
};

Game.prototype.checkForTurnEndAndUpdate = function() {
  return new Promise((resolve, reject) => {
    var teamPromises = [];
    this.data.teams.forEach(team => {
      teamPromises.push(Team.findById(team));
    });
    Promise.all(teamPromises).then(teams => {
      if (Validator.allGuessesCollected(teams)) {
        console.log("Time for new round");
        // TODO: solve this using promises!!
        this.updateScores(teams).then(() => {
          this.storeLogs(teams).then(() => { 
            this.newTurn().then(() => {
              resolve("New round!");
            });
          });
        });
      } else {
        resolve("Guess submitted");
      }
    });
});
}

Game.prototype.updateScores = function(teams) {
  for(const team of teams) {
    // Give fail scores
    const teamId = team._id.toString();
    const teamIndex = this.data.teams.indexOf(teamId);
    const teamCode = this.data.teamCodes[teamIndex];
    if (team.data.guesses[team] != teamCode) {
      team.data.failPoints += 1;
    }
    // Give success-guess scores
    for (const otherTeam of teams) {
      if (otherTeam != team) {
        if (otherTeam.data.guesses[team] == teamCode) {
          otherTeam.data.guessPoints += 1;
          team.data.otherGuessesPoints += 1;
        }
      }
    }
  }
  const teamPromises = [];
  for (const team of teams) {
    teamPromises.push(team.save());
  }
  return Promise.all(teamPromises);
}

Game.prototype.storeLogs = function(teams) {
  return new Promise((resolve, reject) => {
    const storeLogPromises = [];
    for(let i = 0; i < teams.length; i++) {
      const team = teams[i];
      const gameLogId = this.data.teamLogs[i];
      GameLog.findById(gameLogId).then((gameLog) => {
        gameLog.storeRoundData(team, teams, this.data.teamCodes).then(() => {
          return gameLog.save();
        });
      });
    }
    Promise.all(storeLogPromises).then(() => {
      resolve("Updated logs!");
    })
  });
}

Game.prototype.newTurn = function() {
  this.data.turn = gameData.turn + 1;
  this.data.teamCodes = [];
  this.data.teams.forEach(team => {
    gameData.teamCodes.push(CodeGenerator.generateRandomCode());
  });
  return this.save();
}

Game.prototype.save = function() {
  return new Promise((resolve, reject) => {
    var self = this;
    this.data = this.sanitize(this.data);
    mongoClient.save(COLLECTION_NAME, self).then((storeGameData) => {
      resolve(storeGameData);
    });
  });
};

module.exports = Game;
