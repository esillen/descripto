var express = require("express");
var router = express.Router();
var Team = require("../models/team");

router.get("/", function(req, res, next) {
  Team.getAll(teams => {
    res.send(teams);
  });
});

router.get("/:id", function(req, res, next) {
  if (req.params.id) {
    Team.findById(req.params.id, (team) => {
      res.send(team);
    });
  }
});

router.post("/", function(req, res) {
  console.log("About to add a new team! data: " + req.body);
  var newTeam = new Team(req.body);
  newTeam.save(() => {
    res.send("Added the team!");
  });
});

module.exports = router;
