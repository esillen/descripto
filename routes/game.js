var express = require("express");
var router = express.Router();
var Game = require("../models/game");
var Team = require("../models/team");
var Guess = require("../models/guess");
var Validator = require("../util/validator");
var RandomUtils = require("../util/randomUtils");
var Player = require("../models/player");
var WORDS = require("../data/words.json");

router.get("/", function(req, res, next) {
  Game.getAll().then(games => {
    res.send(games);
  });
});

// Creates a game with players
// { numWords: 4, teams: [ { playerIds: [playerId, teamId2...] }] }
router.post("/createNew", function(req, res, next) {
  var teams = req.body.teams;
  var numWords = req.body.numWords;
  // Make sure all players are unique
  if (Validator.unformedTeamsDoNotContainSamePlayers() && req.body.numWords) {
    // Create teams
    var counter = 0;
    var playerIds = [];
    var shuffledWords = RandomUtils.shuffle(WORDS);
    for (var i = 0; i < teams.length; i++) {
      var teamData = {}
      teamData.words = shuffledWords.slice(i*numWords, i*numWords+numWords);
      teamData.players = teams[i].playerIds;
      var newTeam = new Team(teamData);
      newTeam.save(() => {
        teamData.players.playerIds.forEach(playerId => {
          playerIds.push(playerId);
        });
        counter++;
        if (counter == teams.length) {
          // Add game to players
          counter = 0;
          playerIds.forEach(playerId => 
            Player.addGameToPlayerById(playerId, )
          )
        }
      });
    }
  } else {
    res.send("Two Players have the same id :(");
  }
});

router.get("/:gameid", function(req, res, next) {
  Game.findById(req.params.gameid, (game) => {
    res.send(game);
  });
});

router.post("/", function(req, res) {
  console.log("About to add a new game! data: " + req.body);
  var newGame = new Game(req.body);
  newGame.save(() => {
    res.send("Added the game!");
  });
});

router.post("/:gameid/teamguess/:teamid", (req, res) => {
  console.log("Guessed on own team. data: ");
  console.log(req.body);
  var guess = new Guess(req.body);
  Game.findById(req.params.gameid, (game) => {
    guess.data = guess.sanitize(guess.data); // Can't this be done inside the class?
    if (guess.data.turn == game.data.turn) {
      var teamIndex = game.data.teams.indexOf(req.params.teamid);
      var code = game.data.teamCodes[teamIndex];
      if (code == guess.data.code) {
        res.send("CORRECT!!!");
      } else {
        res.send("Guess was incorrect!");
      }
    } else {
      res.send("Guess was submitted for the wrong turn");
    }
  });
});

router.post("/:gameid/otherteamguess/:teamid/:otherteamid", (req, res) => {
  console.log("Guessed on the other team. data: ");
  console.log(req.body);
  var guess = new Guess(req.body);
  Game.findById(req.params.gameid, (game) => {
    guess.data = guess.sanitize(guess.data); // Can't this be done inside the class?
    if (guess.data.turn == game.data.turn) {
      var teamIndex = game.data.teams.indexOf(req.params.otherteamid);
      var code = game.data.teamCodes[teamIndex];
      if (code == guess.data.code) {
        res.send("CORRECT!!!");
      } else {
        res.send("Guess was incorrect!");
      }
    } else {
      res.send("Guess was submitted for the wrong turn");
    }
  });
});

module.exports = router;
