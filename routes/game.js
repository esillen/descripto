var express = require("express");
var router = express.Router();
var Game = require("../models/game");

router.get("/", function(req, res, next) {
  Game.getAll(games => {
    res.send(games);
  });
});

router.get("/:id", function(req, res, next) {
  if (req.params.id) {
    Game.findById(req.params.id, (game) => {
      res.send(game);
    });
  }
});

router.post("/", function(req, res) {
  console.log("About to add a new game! data: " + req.body);
  var newGame = new Game(req.body);
  newGame.save(() => {
    res.send("Added the game!");
  });
});

module.exports = router;
