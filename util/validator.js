var Validator = {};

// Checks if all teams has guesses
Validator.allGuessesCollected = function(teams) {
  for (const team of teams) {
    var teamGuessesTeamIds = Object.keys(team.data.guesses);
    if (teamGuessesTeamIds.length != teams.length) {
      return false;
    }
    Object.keys(team.data.guesses).forEach(guessTeamId => {
      if (!team.data.guesses[guessTeamId]) {
        return false;
      }
    });
  };
  return true;
}

// Checks so all players are unique
// unformedTeams: [[playerId, playerId2...], [playerId, playerId2...] ]
Validator.unformedTeamsDoNotContainSamePlayers = function(unformedTeams) {
  var encounteredPlayerIds = {};
  for(const team of unformedTeams) {
    for(const playerId of team) {
      if (encounteredPlayerIds[playerId]) {
        return false;
      } else {
        encounteredPlayerIds[playerId] = true;
      }
    }
  }
  return true;
}


module.exports = Validator;
