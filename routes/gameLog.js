var express = require("express");
var router = express.Router();
var GameLog = require("../models/gameLog");

router.get("/", function(req, res, next) {
  GameLog.getAll(gameLogs => {
    res.send(gameLogs);
  });
});

router.get("/:id", function(req, res, next) {
  if (req.params.id) {
    GameLog.findById(req.params.id, (gameLog) => {
      res.send(gameLog);
    });
  }
});

router.post("/", function(req, res) {
  console.log("About to add a new gameLog! data: " + req.body);
  var newGameLog = new GameLog(req.body);
  newGameLog.save(() => {
    res.send("Added the gameLog!");
  });
});

module.exports = router;
