var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");

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

Game.findById = function(id) {
  return new Promise((resolve, reject) => {
    mongoClient.findById(COLLECTION_NAME, id, function(gameData) {
      resolve(new Game(gameData.data));
    });
  });
};

Game.getAll = function() {
  return new Promise((resolve, reject) => {
    mongoClient.getAll(COLLECTION_NAME, function(gamesDatas) {
      var games = [];
      console.log(gamesDatas);
      gamesDatas.forEach(gameData => {
        games.push(new Game(gameData));
      });
      resolve(games);
    });
  });
};

Game.prototype.save = function() {
  return new Promise((resolve, reject) => {
    var self = this;
    this.data = this.sanitize(this.data);
    mongoClient.save(COLLECTION_NAME, self);
    resolve();
  });
};

module.exports = Game;
