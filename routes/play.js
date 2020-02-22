var express = require('express');
var router = express.Router();
var Game = require('../models/game');
var Player = require('../models/player');
var Team = require('../models/team');
var GameLog = require('../models/gameLog');
var LogWordFilter = require('../util/logWordFilter');

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

// TODO: can probably reduce the fetches here by adding team to route.
router.get('/:playerid/:gameid', function(req, res, next) {
  Game.findById(req.params.gameid).then(game => {
    Player.findById(req.params.playerid).then(player => {
      Team.findAmongIdsByPlayerId(game.data.teams, player._id).then(team => {
        GameLog.findById(team.data.log).then(gameLog => {
          const getTeamPromises = [];
          for (const teamId of game.data.teams) {
            getTeamPromises.push(Team.findById(teamId));
          }
          Promise.all(getTeamPromises).then((allTeams) => {
            const otherTeams = allTeams.filter(aTeam => aTeam._id.toString() != team._id.toString())
            const teamTurnsLog = gameLog.data.teams.find(teamLog => teamLog.teamId == team._id.toString()).turns;
            const wordHints = LogWordFilter.filterLogsToWords(teamTurnsLog, game.data.numWords)
            res.render('play_playerid_gameid', { title: 'DESCRIPTO', game: game, player: player, teamTurnsLog: teamTurnsLog, thingsLeftToDo: game.getThingsLeftToDo(allTeams), team: team, otherTeams: otherTeams, wordHints: wordHints});
          });
        }); 
      });
    });
  });
});

// TODO: can probably reduce the fetches here by adding own team to route.
router.get('/:playerid/:gameid/:otherteamid', function(req, res, next) {
  Game.findById(req.params.gameid).then(game => {    
    Player.findById(req.params.playerid).then(player => {
      Team.findAmongIdsByPlayerId(game.data.teams, player._id).then(team => {
        Team.findById(req.params.otherteamid).then((otherteam) => {
          GameLog.findById(team.data.log).then(gameLog => {
            const teamTurnsLog = gameLog.data.teams.find(teamLog => teamLog.teamId == otherteam._id.toString()).turns;
            const wordHints = LogWordFilter.filterLogsToWords(teamTurnsLog, game.data.numWords)
            res.render('play_playerid_gameid_otherteamid', { title: 'DESCRIPTO', game: game, player: player, teamTurnsLog: teamTurnsLog, team: team, otherteam: otherteam, wordHints: wordHints});
          });
        }); 
      });
    });
  });
});

module.exports = router;
