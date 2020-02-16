var express = require("express");
var router = express.Router();
var Game = require("../models/game");
var Team = require("../models/team");
var Guess = require("../models/guess");

router.get("/", function(req, res, next) {
  Game.getAll(games => {
    res.send(games);
  });
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
