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

GameLog.prototype.changeName = function(data) {
  this.data = this.sanitize(data);
};

GameLog.findById = function(id, callback) {
  mongoClient.findById(COLLECTION_NAME, id, function(gameLogData) {
    callback(new GameLog(gameLogData));
  });
};

GameLog.getAll = function(callback) {
  mongoClient.getAll(COLLECTION_NAME, function(gameLogsDatas) {
    var gameLogs = [];
    console.log(gameLogsDatas);
    gameLogsDatas.forEach(gameLogData => {
      gameLogs.push(new GameLog(gameLogData));
    });
    callback(gameLogs);
  });
};

GameLog.prototype.save = function(callback) {
  var self = this;
  this.data = this.sanitize(this.data);
  mongoClient.save(COLLECTION_NAME, self);
  callback();
};

module.exports = GameLog;
