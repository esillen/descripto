var Validator = {};

// Checks if all teams has guesses
Validator.allGuessesCollected = function(teams) {
  teams.forEach(team => {
    var teamGuessesTeamIds = Object.keys(team.data.guesses);
    if (teamGuessesTeamIds.length != teams.length) {
      return false;
    }
    Object.keys(team.data.guesses).forEach(guessTeamId => {
      if (!team.data.guesses[guessTeamId]) {
        return false;
      }
    })
  });
  return true;
}

// Checks so all players are unique
// unformedTeams: [ { playerIds: [playerId, teamId2...] }]
Validator.unformedTeamsDoNotContainSamePlayers = function(unformedTeams) {
  var encounteredPlayerIds = {};
  unformedTeams.forEach(team => {
    team.playerIds.forEach(playerId => {
      if (encounteredPlayerIds.playerId) {
        return false;
      } else {
        encounteredPlayerIds.playerId = true;
      }
    });
  });
  return true;
}


module.exports = Validator;
