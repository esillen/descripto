var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");

var COLLECTION_NAME = "GameLogs";

var GameLog = function(data, _id) {
  this.data = data;
  if (_id) {
    this._id = _id;
  }
};

GameLog.prototype.data = {};

GameLog.prototype.sanitize = function(data) {
  data = data || {};
  schema = schemas.gameLog;
  return _.pick(_.defaults(data, schema), _.keys(schema));
};

// Returns an id with the newly created gamelog
GameLog.createNew = function(teamIds) {
  return new Promise((resolve, reject) => {
    const allTeamsLogData = [];
    teamIds.forEach(teamId => {
      const teamLogData = {};
      teamLogData.teamId = teamId;
      teamLogData.turns = [];
      allTeamsLogData.push(teamLogData)
    });
    var gameLogData = {};
    gameLogData.teams = allTeamsLogData;
    var gameLog = new GameLog(gameLogData);
    gameLog.data = gameLog.sanitize(gameLog.data);
    gameLog.save().then(gameLogSaveData => {
      resolve(gameLogSaveData._id.toString());
    });
  });
}

GameLog.findById = function(id) {
  return new Promise((resolve, reject) => {
    mongoClient.findById(COLLECTION_NAME, id).then(gameLogData => {
      resolve(new GameLog(gameLogData.data, gameLogData._id));
    });
  });
};

GameLog.getAll = function() {
  return new Promise((resolve, reject) => {
    mongoClient.getAll(COLLECTION_NAME).then(gameLogsDatas => {
      var gameLogs = [];
      console.log(gameLogsDatas);
      gameLogsDatas.forEach(gameLogData => {
        gameLogs.push(new GameLog(gameLogData.data, gameLogData._id));
      });
      resolve(gameLogs);
    });
  });
};

GameLog.prototype.storeRoundData = function(thisTeam, teams, correctCodes) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      const teamLog = this.data.teams[i];
      if (teamLog.teamId == team._id) {
        const turnLogData = {};
        turnLogData.hints = team.data.hints;
        turnLogData.correct = correctCodes;
        turnLogData.guess = thisTeam.data.guess[team._id];
        turnLogData.theirGuess = team.data.gess[team._id];
        teamLog.push(turnLogData);
        this.save().then(() => {
          resolve("Stored game log!");
        });
      } else {
        reject ("Something is wrong. The teams should be ordered at this point.");
      }
    }
  });
}

GameLog.prototype.save = function() {
  return new Promise((resolve, reject) => {
    var self = this;
    this.data = this.sanitize(this.data);
    mongoClient.save(COLLECTION_NAME, self).then(createdData => {
      resolve(createdData)
    });
  });
};

module.exports = GameLog;
