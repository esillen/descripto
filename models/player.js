var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");

var COLLECTION_NAME = "Players";

var Player = function(data, _id) {
  this.data = data;
  if (_id) {
    this._id = _id;
  }
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
    mongoClient.findById(COLLECTION_NAME, id).then(playerData => {
      resolve(new Player(playerData.data, playerData._id));
    });
  })
};

// TODO: should rather be a prototype method 
Player.addGameToPlayerById = function(playerId, game) {
  return new Promise((resolve, reject) => {
    Player.findById(playerId).then(player => {
      if (!player.data.currentGames) {
        player.data.currentGames = [];
      }
      player.data.currentGames.push(game._id.toString());
      player.save().then((saveData) => {
        resolve();
      });
    });
  });
}

Player.getAll = function() {
  return new Promise((resolve, reject) => {
    mongoClient.getAll(COLLECTION_NAME).then(playerDatas => {
      var players = [];
      playerDatas.forEach(playerData => {
        players.push(new Player(playerData.data, playerData._id));
      });
      resolve(players);
    });
  });
};

Player.prototype.save = function() {
  return new Promise((resolve, reject) => {
    this.data = this.sanitize(this.data);
    mongoClient.save(COLLECTION_NAME, this).then(() => {
      resolve();
    });
  });
};

module.exports = Player;
