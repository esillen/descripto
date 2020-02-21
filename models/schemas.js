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
    log: null, // the log id
  },
  game: {
    teams: [], //List of team ids
    numWords: 0,
    turn: 0,
  },
  gameLog: {
    ownerTeam: null,
    teams: [
      {
        teamId : null,
        turns: [
          {
            hints: [],
            guess: [],
            theirGuess: [],
            correct: [],
          }
        ]
      }
    ]
  }
};

module.exports = schemas;
