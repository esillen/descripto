var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");

var COLLECTION_NAME = "GameLogs";

var GameLog = function(data) {
  this.data = data;
};

GameLog.prototype.data = {};

GameLog.prototype.sanitize = function(data) {
  data = data || {};
  schema = schemas.gameLog;
  return _.pick(_.defaults(data, schema), _.keys(schema));
};

// Returns an id with the newly created gamelog
GameLog.createNew = function(teams) {
  return new Promise((resolve, reject) => {
    var teamLogData = [];
    teams.forEach(team => {
      teamLogData.teamId = team;
      teamLogData.turns = [];
    });
    var gameLogData = {};
    gameLogData.teams = teamLogData;
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
      resolve(new GameLog(gameLogData));
    });
  });
};

GameLog.getAll = function() {
  return new Promise((resolve, reject) => {
    mongoClient.getAll(COLLECTION_NAME).then(gameLogsDatas => {
      var gameLogs = [];
      console.log(gameLogsDatas);
      gameLogsDatas.forEach(gameLogData => {
        gameLogs.push(new GameLog(gameLogData));
      });
      resolve(gameLogs);
    });
  });
};

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
