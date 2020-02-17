var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");

var COLLECTION_NAME = "Teams";

var Team = function(data, _id) {
  this.data = data;
  if (_id) {
    this._id = _id;
  }
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
      resolve(new Team(teamData.data, teamData._id));
    });
  });
};

Team.getAll = function() {
  return new Promise((resolve, reject) => {
    mongoClient.getAll(COLLECTION_NAME).then(teamsDatas => {
      var teams = [];
      console.log(teamsDatas);
      teamsDatas.forEach(teamData => {
        teams.push(new Team(teamData.data, teamData._id));
      });
      resolve(teams);
    });
  });
};

// Returns the created teams' id
Team.createNew = function(teamMembersPlayerIds, words) {
  return new Promise((resolve, reject) => {
    var teamData = {};
    teamData.players = teamMembersPlayerIds;
    teamData.words = words;
    var newTeam = new Team(teamData);
    newTeam.save().then(saveData => {
      resolve(saveData._id.toString());
    })
  });
}

Team.prototype.save = function() {
  return new Promise((resolve, reject) => {
    var self = this;
    this.data = this.sanitize(this.data);
    mongoClient.save(COLLECTION_NAME, self).then((data) => {
      resolve(data);
    });
  });
};

module.exports = Team;
