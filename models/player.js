var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");

var COLLECTION_NAME = "Players";

var Player = function(data) {
  this.data = data;
};

Player.prototype.data = {};

Player.prototype.sanitize = function(data) {
  data = data || {};
  schema = schemas.player;
  return _.pick(_.defaults(data, schema), _.keys(schema));
};

Player.findById = function(id, callback) {
  console.log("find by id! " + id);
  mongoClient.findById(COLLECTION_NAME, id, function(playerData) {
    callback(new Player(playerData));
  });
};

Player.getAll = function(callback) {
  mongoClient.getAll(COLLECTION_NAME, function(playerDatas) {
    var players = [];
    console.log(playerDatas);
    playerDatas.forEach(playerData => {
      players.push(new Player(playerData));
    });
    callback(players);
  });
};

Player.prototype.save = function(callback) {
  var self = this;
  this.data = this.sanitize(this.data);
  mongoClient.save(COLLECTION_NAME, self);
  callback();
};

module.exports = Player;
