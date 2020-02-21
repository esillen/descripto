var express = require("express");
var router = express.Router();
var Game = require("../models/game");
var Team = require("../models/team");
var Validator = require("../util/validator");
var RandomUtils = require("../util/randomUtils");
var Player = require("../models/player");
var WORDS = require("../data/words.json");
var GameLog = require("../models/gameLog");

router.get("/", function(req, res, next) {
  Game.getAll().then(games => {
    res.send(games);
  });
});

router.get("/createNew", function(req, res, next) {
  Player.getAll().then((players) => {
    res.render('game-createnew', { title: 'DESCRIPTO', players: players });
  });
});

// Creates a game with players
// { numWords: 4, teams1: [playerId1, playerId2...], team2: [playerId1, playerId2...] }
router.post("/createNew", function(req, res, next) {
  var numWords = parseInt(req.body.numWords);
  var teamNames = [req.body.team1name, req.body.team2name]
  var teams = [req.body.team1, req.body.team2];
  // Make sure all players are unique
  if (Validator.unformedTeamsDoNotContainSamePlayers(teams) && req.body.numWords) {
    // Create teams
    var shuffledWords = RandomUtils.shuffle(WORDS);
    var playerIds = [];
    var teamPromises = [];
    for (var i = 0; i < teams.length; i++) {
      teamPromises.push(Team.createNew(
          teamNames[i],
          teams[i], 
          shuffledWords.slice(i*numWords, i*numWords + numWords)));
      for(const playerId of teams[i]) {
        playerIds.push(playerId); // Players are saved for later when we add the gameid to the players.
      }
    }
    Promise.all(teamPromises).then(teams => {
      const logPromises = [];
      for (const team of teams) {
        logPromises.push(GameLog.createNew(team, teams));
      }
      Promise.all(logPromises).then(teamLogs => {
        const saveTeamPromises = [];
        for (const teamLog of teamLogs) {
          const ownerTeam = teams.find(team => team._id.toString() == teamLog.data.ownerTeam);
          ownerTeam.data.log = teamLog._id.toString();
          saveTeamPromises.push(ownerTeam.save());
        }
        Promise.all(saveTeamPromises).then((IDONTCARE) => {
          Game.createNew(teams).then(newGame => {
            var playerPromises = [];
            playerIds.forEach(playerId => {
              playerPromises.push(Player.addGameToPlayerById(playerId, newGame));
            });
            Promise.all(playerPromises).then(() => {
              res.send("OMG CREATED A NEW GAME!! Id:" + newGame._id.toString());
            });
          });
        });
      });
    });
  }
});

router.get("/:gameid", function(req, res, next) {
  Game.findById(req.params.gameid).then(game => {
    res.send(game);
  });
});

router.post("/", function(req, res) {
  console.log("About to add a new game! data: " + req.body);
  var newGame = new Game(req.body);
  newGame.save().then(() => {
    res.send("Added the game!");
  });
});

module.exports = router;
