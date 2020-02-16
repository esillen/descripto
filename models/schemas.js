schemas = {
  player: {
    name: null,
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
  },
  game: {
    teams: [], //List of team ids
    teamLogs: [], // List of log ids
    teamCodes: [], // Codes in paintext
    turn: 0,
  },
  game_log: {
    teams: [
      {
        turns: {
          hints: [],
          guesses: [],
          theirGuesses: []
        }
      }
    ]
  }
};

module.exports = schemas;
