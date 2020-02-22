var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");
var CodeGenerator = require("../util/codeGenerator");
var Validator = require("../util/validator");
var Team = require('./team');
var GameLog = require('./gameLog');


var COLLECTION_NAME = "Games";

var Game = function(data, _id) {
  this.data = data;
  if (_id) {
    this._id = _id;
  }
};

Game.prototype.data = {};

Game.prototype.sanitize = function(data) {
  data = data || {};
  schema = schemas.game;
  return _.pick(_.defaults(data, schema), _.keys(schema));
};

Game.createNew = function(teams, numWords) {
  return new Promise((resolve, reject) => {
    var gameData = {};
    gameData.teams = teams.map(team => team._id.toString());
    gameData.numWords = numWords;
    gameData.turn = 0;
    var newGame = new Game(gameData);
    newGame.newTurn().then(() => {
      newGame.save().then(storeGameData => {
        resolve(storeGameData);
      });
    });
  });
}

Game.findById = function(id) {
  return new Promise((resolve, reject) => {
    mongoClient.findById(COLLECTION_NAME, id).then(gameData => {
      resolve(new Game(gameData.data, gameData._id));
    });
  });
};

Game.getAll = function() {
  return new Promise((resolve, reject) => {
    mongoClient.getAll(COLLECTION_NAME).then(gamesDatas => {
      var games = [];
      console.log(gamesDatas);
      gamesDatas.forEach(gameData => {
        games.push(new Game(gameData.data, gameData._id));
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

Game.prototype.getGameDisplayData = function() {
  return new Promise((resolve, reject) => {
    const getTeamPromises = [];
    for (const teamId of this.data.teams) {
      getTeamPromises.push(Team.findById(teamId));
    }
    Promise.all(getTeamPromises).then(teams => {
      const teamNames = teams.map(team => team.data.name);
      const gameDisplayData = {gameId: this._id, teamNames: teamNames, turn: this.data.turn}
      resolve(gameDisplayData);
    });
  });
}

// TODO: perhaps move to another module
Game.prototype.getThingsLeftToDo = function(teams) {
  const thingsLeftToDo = {};
  for(const team of teams) {
    if (!team.data.hints || team.data.hints.length == 0) {
      thingsLeftToDo[team._id.toString()] = `${team.data.name} has not submitted any hints!`
    } else {
      for (otherTeam of teams) {
        if (!team.data.guesses[otherTeam._id.toString()]) {
          thingsLeftToDo[team._id.toString()] = `${team.data.name} has not guessed the code of ${otherTeam.data.name}!`
        }
      }
    }
  }
  return thingsLeftToDo;
}

// TODO: perhaps move to another module
Game.prototype.updateScores = function(teams) {
  for(const team of teams) {
    // Give fail scores
    const teamCode = team.data.code;
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

Game.prototype.storeLogs = function(teams, turn) {
  return new Promise((resolve, reject) => {
    const teamKeyValue = {}; // teamId: guesses for other teams
    const getGameLogPromises = [];
    for(const team of teams) {
      teamKeyValue[team._id.toString()] = team;
      getGameLogPromises.push(GameLog.findById(team.data.log))
    }
    Promise.all(getGameLogPromises).then(gameLogs => {
      const storeGameLogPromises = [];
      for(const gameLog of gameLogs) {
        const currentTeam = teamKeyValue[gameLog.data.ownerTeam];
        for(const gameLogTeamData of gameLog.data.teams) {
          const otherTeamId = gameLogTeamData.teamId;
          const otherTeam = teamKeyValue[otherTeamId];
          const newTurnLogData = {};
          newTurnLogData.hints = otherTeam.data.hints;
          newTurnLogData.guess = currentTeam.data.guesses[otherTeamId];
          newTurnLogData.theirGuess = otherTeam.data.guesses[otherTeamId];
          newTurnLogData.correct = otherTeam.data.code;
          gameLogTeamData.turns.push(newTurnLogData);
        }
        storeGameLogPromises.push(gameLog.save());
      }
      Promise.all(storeGameLogPromises).then(logs => {
        resolve(logs);
      })
    });
  });
}

Game.prototype.newTurn = function() {
  return new Promise((resolve, reject) => {
    this.data.turn = this.data.turn + 1;
    this.data.teamCodes = [];
    const getTeamPromises = []
    for(const teamId of this.data.teams) {
      this.data.teamCodes.push(CodeGenerator.generateRandomCode());
      getTeamPromises.push(Team.findById(teamId));
    }
    Promise.all(getTeamPromises).then(teams => {
      const teamNewTurnPromises = [];
      for(const team of teams) {
        teamNewTurnPromises.push(team.newTurn());
      }
      Promise.all(teamNewTurnPromises).then(() => {
        this.save().then(() => resolve());
      });
    });
  });
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
