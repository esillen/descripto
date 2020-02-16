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

Player.findById = function(id) {
  return new Promise((resolve, reject) => {
    console.log("find by id! " + id);
    mongoClient.findById(COLLECTION_NAME, id, function(playerData) {
      resolve(new Player(playerData));
    });
  })
};

Player.addGameToPlayerById = function(playerId, gameId) {
  return new Promise((resolve, reject) => {
    Player.findById(playerId, (player) => {
      player.data.currentGames.push(gameId);
      player.save(() => {
        resolve();
      })
    })
  });
}

Player.getAll = function() {
  return new Promise((resolve, reject) => {
    mongoClient.getAll(COLLECTION_NAME, function(playerDatas) {
      var players = [];
      playerDatas.forEach(playerData => {
        players.push(new Player(playerData));
      });
      resolve(players);
    });
  });
};

Player.prototype.save = function() {
  return new Promise((resolve, reject) => {
    var self = this;
    this.data = this.sanitize(this.data);
    mongoClient.save(COLLECTION_NAME, self);
    resolve();
  });
};

module.exports = Player;
