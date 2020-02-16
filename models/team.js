var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");

var COLLECTION_NAME = "Teams";

var Team = function(data) {
  this.data = data;
};

Team.prototype.data = {};

Team.prototype.sanitize = function(data) {
  data = data || {};
  schema = schemas.team;
  return _.pick(_.defaults(data, schema), _.keys(schema));
};

Team.findById = function(id, callback) {
  mongoClient.findById(COLLECTION_NAME, id, function(teamData) {
    callback(new Team(teamData));
  });
};

Team.getAll = function(callback) {
  mongoClient.getAll(COLLECTION_NAME, function(teamsDatas) {
    var teams = [];
    console.log(teamsDatas);
    teamsDatas.forEach(teamData => {
      teams.push(new Team(teamData));
    });
    callback(teams);
  });
};

Team.prototype.save = function(callback) {
  var self = this;
  this.data = this.sanitize(this.data);
  mongoClient.save(COLLECTION_NAME, self);
  callback();
};

module.exports = Team;
