var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");
var CodeGenerator = require("../util/codeGenerator");


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

Game.prototype.newTurn = function() {
  gameData.turn = 1;
  gameData.teamCodes = [];
  gameData.teams.forEach(team => {
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
