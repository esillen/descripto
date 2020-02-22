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
  Player.findById(req.params.playerid).then((player) => {
    const getGamePromises = [];
    for (const currentGameId of player.data.currentGames) {
      getGamePromises.push(Game.findById(currentGameId));
    }
    Promise.all(getGamePromises).then((currentGames) => {
      const getGameDisplayDataPromises = [];
      for(const currentGame of currentGames) {
        getGameDisplayDataPromises.push(currentGame.getGameDisplayData());
      }
      Promise.all(getGameDisplayDataPromises).then(gameDisplayDatas => {
        res.render('play_playerid', { title: 'DESCRIPTO', gameDisplayDatas: gameDisplayDatas, player: player});
      });
    });
  });
});

router.get('/:playerid/:gameid', function(req, res, next) {
  Game.findById(req.params.gameid).then(game => {
    Player.findById(req.params.playerid).then(player => {
      Team.findAmongIdsByPlayerId(game.data.teams, player._id).then(team => {
        GameLog.findById(team.data.log).then(gameLog => {
          const otherTeamPromises = [];
          for (const otherTeamId of game.data.teams) {
            if (otherTeamId != team._id) {
              otherTeamPromises.push(Team.findById(otherTeamId));
            }
          }
          Promise.all(otherTeamPromises).then((otherTeams) => {
            const teamTurnsLog = gameLog.data.teams.find(teamLog => teamLog.teamId == team._id.toString()).turns;
            res.render('play_playerid_gameid', { title: 'DESCRIPTO', game: game, player: player, teamTurnsLog: teamTurnsLog, thingsLeftToDo: game.getThingsLeftToDo(otherTeams), team: team, otherTeams: otherTeams});
          });
        }); 
      });
    });
  });
});

router.get('/:playerid/:gameid/:otherteamid', function(req, res, next) {
  Game.findById(req.params.gameid).then(game => {
    Player.findById(req.params.playerid).then(player => {
      Team.findAmongIdsByPlayerId(game.data.teams, player._id).then(team => {
        Team.findById(req.params.otherteamid).then((otherteam) => {
          GameLog.findById(team.data.log).then(gameLog => {
            const teamTurnsLog = gameLog.data.teams.find(teamLog => teamLog.teamId == otherteam._id.toString()).turns;
            res.render('play_playerid_gameid_otherteamid', { title: 'DESCRIPTO', game: game, player: player, teamTurnsLog: teamTurnsLog, team: team, otherteam: otherteam});
          });
        }); 
      });
    });
  });
});

module.exports = router;
