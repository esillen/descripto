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

Game.findById = function(id, callback) {
  mongoClient.findById(COLLECTION_NAME, id, function(gameData) {
    callback(new Game(gameData.data));
  });
};

Game.getAll = function(callback) {
  mongoClient.getAll(COLLECTION_NAME, function(gamesDatas) {
    var games = [];
    console.log(gamesDatas);
    gamesDatas.forEach(gameData => {
      games.push(new Game(gameData));
    });
    callback(games);
  });
};

Game.prototype.save = function(callback) {
  var self = this;
  this.data = this.sanitize(this.data);
  mongoClient.save(COLLECTION_NAME, self);
  callback();
};

module.exports = Game;
