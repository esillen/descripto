const LogWordFilter = {}

LogWordFilter.filterLogsToWords = function(teamTurnsLog, numWords) {
  const wordsHints = [];
  for(let i = 0; i < numWords; i++) {
    wordsHints.push([]);
  }
  for(const teamLogTurn of teamTurnsLog) {
    for(let i = 0; i < 3; i++) {
      const wordIndex = parseInt(teamLogTurn.correct[i]) - 1;
      wordsHints[wordIndex].push(teamLogTurn.hints[i]);
    }
  }
  return wordsHints;
}

module.exports = LogWordFilter;