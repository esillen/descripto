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
    name: null, 
    words: [],
    hints: [],
    code: [], // 1,2,3 for example
    guessPoints: 0, // good
    otherGuessesPoints: 0, // bad
    failPoints: 0, // bad
    players: [],
    cryptographer: null,
    guesses: {}, // Key-value store with teamId: guess
  },
  game: {
    teams: [], //List of team ids
    teamLogs: [], // List of log ids
    turn: 0,
  },
  gameLog: {
    teams: [
      {
        teamId : null,
        turns: [
          {
            hints: [],
            guess: null,
            theirGuess: null,
            correct: null,
          }
        ]
      }
    ]
  }
};

module.exports = schemas;
