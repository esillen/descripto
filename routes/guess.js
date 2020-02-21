const express = require("express");
const router = express.Router();
const Game = require("../models/game")
const Team = require("../models/team")

router.post("/:gameid/guessingTeam/:teamid/otherTeam/:otherteamid", (req, res) => {
  console.log("Guessed on other team. data: ");
  console.log(req.body);
  Game.findById(req.params.gameid).then(game => {
    //if (req.body.turn.data.turn == game.data.turn) {
      Team.findById(req.params.teamid).then(team => {
        //TODO REINTRODUCE if (!team.data.guesses[req.params.otherteamid]) {
          team.data.guesses[req.params.otherteamid] = req.body.guess;
          team.save().then(() => {
            game.checkForTurnEndAndUpdate();
            res.send("Guess was submitted");
          });
        //} else {
          //res.send("A guess already exist. Sorry!");
        //}
      });
    /*} else {
      res.send("Guess was submitted for the wrong turn");
    }*/
  });
});

module.exports = router;
