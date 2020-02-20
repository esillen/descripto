var express = require('express');
var router = express.Router();
var Game = require('../models/game');
var Player = require('../models/player');
var Team = require('../models/team');
var GameLog = require('../models/gameLog');

router.get('/', function(req, res, next) {
  Player.getAll().then((players) => {
    res.render('play', { title: 'DESCRIPTO', players: players });
  });
});

router.get('/:playerid', function(req, res, next) {
  Game.getAll().then((games) => {
    res.render('play_playerid', { title: 'DESCRIPTO', games: games, playerid: req.params.playerid});
  });
});

router.get('/:playerid/:gameid', function(req, res, next) {
  Game.findById(req.params.gameid).then(game => {
    Player.findById(req.params.playerid).then(player => {
      Team.findAmongIdsByPlayerId(game.data.teams, player._id).then(team => {
        GameLog.findSomeById(game.data.teamLogs).then(gameLogs => {
          res.render('play_playerid_gameid', { title: 'DESCRIPTO', game: game, player: player, gameLogs: gameLogs, team: team});
        }); 
      });
    });
  });
});


module.exports = router;
