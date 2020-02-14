schemas = {
  player: {
    name: null,
  },
  team: {
    words: [],
    guess_points: 0,
    fail_points: 0,
    players: [],
    cryptographer: null,
  },
  game: {
    team1: null,
    team2: null,
    turn: 0,
    log: null,
    code1: null,
    code2: null,
  },
  gameLog: {
    turns: [
      {
        team: null,
        entries : [
          {
            clue: null,
            guess: 0,
            correct: 0
          }
        ]
      }
    ]
  }
};

module.exports = schemas;
