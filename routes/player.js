var express = require("express");
var router = express.Router();
var Player = require("../models/player");

router.get("/", function(req, res, next) {
  Player.getAll().then(players => {
    res.send(players);
  });
});

router.get("/:id", function(req, res, next) {
  if (req.params.id) {
    Player.findById(req.params.id).then(player => {
      res.send(player);
    });
  }
});

router.post("/", function(req, res) {
  console.log("About to add a new player! data: " + req.body);
  var newPlayer = new Player(req.body);
  newPlayer.save.then(() => {
    res.send("Added the player!");
  });
});

module.exports = router;
