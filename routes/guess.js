const express = require("express");
const router = express.Router();
const Game = require("../models/game")
const Team = require("../models/team")

router.post("/:gameid/guessingTeam/:teamid/otherTeam/:otherteamid", (req, res) => {
  console.log("Guessed on other team. data: ");
  console.log(req.body);
  const guessArray = req.body.guess.split("").map(numberString => parseInt(numberString));
  Game.findById(req.params.gameid).then(game => {
    //if (req.body.turn.data.turn == game.data.turn) {
      Team.findById(req.params.teamid).then(team => {
        if (!team.data.guesses[req.params.otherteamid]) {
          team.data.guesses[req.params.otherteamid] = guessArray;
          team.save().then(() => {
            game.checkForTurnEndAndUpdate();
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.redirect('back');
          });
        } else {
          res.send("A guess already exist. Sorry!");
        }
      });
    /*} else {
      res.send("Guess was submitted for the wrong turn");
    }*/
  });
});

module.exports = router;
