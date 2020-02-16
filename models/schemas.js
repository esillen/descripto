schemas = {
  player: {
    name: null,
    currentGames: [],
  },
  guess: {
    code: null,
    turn: 0,
  },
  team: {
    words: [],
    guessPoints: 0,
    failPoints: 0,
    players: [],
    cryptographer: null,
    guesses: {}, // Key-value store with teamId: guess
  },
  game: {
    teams: [], //List of team ids
    teamLogs: [], // List of log ids
    teamCodes: [], // Codes in paintext
    turn: 0,
  },
  gameLog: {
    teams: [
      {
        teamId : null,
        turns: [
          {
            hints: [],
            guesses: [],
            theirGuesses: []
          }
        ]
      }
    ]
  }
};

module.exports = schemas;
