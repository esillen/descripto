var express = require("express");
var router = express.Router();
var Team = require("../models/team");

router.post("/:gameid/team/:teamid", function(req, res, next) {
  Team.findById(req.params.teamid).then((team) => {
    team.data.hints = [req.body.hint1, req.body.hint2, req.body.hint3];
    team.save().then(() => {
      res.send("HINTS SUBMITTED!");
    });
  });
});

module.exports = router;
