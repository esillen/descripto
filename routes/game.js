var express = require("express");
var router = express.Router();
var Game = require("../models/game");
var Team = require("../models/team");
var Guess = require("../models/guess");
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
  var teams = [req.body.team1, req.body.team2];
  // Make sure all players are unique
  if (Validator.unformedTeamsDoNotContainSamePlayers(teams) && req.body.numWords) {
    // Create teams
    var shuffledWords = RandomUtils.shuffle(WORDS);
    var players = [];
    var teamPromises = [];
    for (var i = 0; i < teams.length; i++) {
      teamPromises.push(Team.createNew(
          teams[i], 
          shuffledWords.slice(i*numWords, i*numWords + numWords)));
      for(const playerId of teams[i]) {
        players.push(playerId); // Players are saved for later when we add the gameid to the players.
      }
    }
    Promise.all(teamPromises).then(teamIds => {
      const logPromises = [];
      for (const teamId of teamIds) {
        logPromises.push(GameLog.createNew(teamIds));
      }
      Promise.all(logPromises).then(teamLogIds => {
        Game.createNew(teamIds, teamLogIds).then(newGameId => {
          var playerPromises = [];
          players.forEach(playerId => {
            playerPromises.push(Player.addGameToPlayerById(playerId, newGameId));
          });
          Promise.all(playerPromises).then(() => {
            res.send("OMG CREATED A NEW GAME!! Id:" + newGameId);
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
