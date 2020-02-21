var mongoClient = require("../db/mongoClient");
var schemas = require("./schemas.js");
var _ = require("lodash");
var CodeGenerator = require('../util/codeGenerator');
var GameLog = require('../models/gameLog');

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

Team.findAmongIdsByPlayerId = function(teamIds, playerId) {
  return new Promise((resolve, reject) => {
    const getTeamPromises = [];
    for (const teamId of teamIds) {
      getTeamPromises.push(Team.findById(teamId));
    }
    Promise.all(getTeamPromises).then(teams => {
      let found = null;
      for(const team of teams) {
        if (team.data.players.indexOf(playerId.toString()) != -1) {
          found = team;
          break; // TODO: if I'm better at javascript this would probably look neater.
        }
      }
      if(found) {
        resolve(found);
      } else {
        reject("No team found");
      }
    });
  });
}

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

// Returns the created team
Team.createNew = function(teamName, teamMembersPlayerIds, words) {
  return new Promise((resolve, reject) => {
    var teamData = {};
    teamData.name = teamName;
    teamData.players = teamMembersPlayerIds;
    teamData.words = words;
    var newTeam = new Team(teamData);
    newTeam.save().then(team => {
      resolve(team);
    })
  });
}

Team.prototype.newTurn = function() {
  return new Promise((resolve, reject) => {
    let currentIndex = this.data.players.indexOf(this.data.cryptographer);
    currentIndex = (currentIndex + 1) % this.data.players.length;
    this.data.cryptographer = this.data.players[currentIndex];
    this.data.guesses = {};
    this.data.hints = [];
    this.data.code = CodeGenerator.generateRandomCode(this.data.words.length);
    this.save().then(() => resolve());
  });
}

Team.prototype.save = function() {
  return new Promise((resolve, reject) => {
    var self = this;
    this.data = this.sanitize(this.data);
    mongoClient.save(COLLECTION_NAME, self).then((storeTeamData) => {
      resolve(storeTeamData);
    });
  });
};

module.exports = Team;
