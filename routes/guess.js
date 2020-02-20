const Game = require("../models/game")
const Team = require("../models/team")


router.post("/:gameid/teamguess/:teamid", (req, res) => {
  console.log("Guessed on own team. data: ");
  console.log(req.body);
  var guess = new Guess(req.body);
  guess.data = guess.sanitize(guess.data); // TODO: Can't this be done inside the class?
  Game.findById(req.params.gameid).then(game => {
    if (guess.data.turn == game.data.turn) {
      Team.findById(req.params.teamid).then(team => {
        team.data.guesses[req.params.teamid] = guess.data.code;
        team.save().then(() => {
          game.checkForTurnEndAndUpdate();
          res.send("Guess was submitted");
        });
      });
    } else {
      res.send("Guess was submitted for the wrong turn");
    }
  });
});

router.post("/:gameid/otherteamguess/:teamid/:otherteamid", (req, res) => {
  console.log("Guessed on other team. data: ");
  console.log(req.body);
  var guess = new Guess(req.body);
  guess.data = guess.sanitize(guess.data); // TODO: Can't this be done inside the class?
  Game.findById(req.params.gameid).then(game => {
    if (guess.data.turn == game.data.turn) {
      Team.findById(req.params.teamid).then(team => {
        team.data.guesses[req.params.otherteamid] = guess.data.code;
        team.save().then(() => {
          game.checkForTurnEndAndUpdate();
          res.send("Guess was submitted");
        });
      });
    } else {
      res.send("Guess was submitted for the wrong turn");
    }
  });
});
