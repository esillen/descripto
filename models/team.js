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

Team.findById = function(id) {
  return new Promise((resolve, reject) => {
    mongoClient.findById(COLLECTION_NAME, id).then(teamData => {
      resolve(new Team(teamData));
    });
  });
};

Team.getAll = function() {
  return new Promise((resolve, reject) => {
    mongoClient.getAll(COLLECTION_NAME).then(teamsDatas => {
      var teams = [];
      console.log(teamsDatas);
      teamsDatas.forEach(teamData => {
        teams.push(new Team(teamData));
      });
      resolve(teams);
    });
  });
};

Team.prototype.save = function() {
  return new Promise((resolve, reject) => {
    var self = this;
    this.data = this.sanitize(this.data);
    mongoClient.save(COLLECTION_NAME, self).then(() => {
      resolve();
    });
  });
};

module.exports = Team;
