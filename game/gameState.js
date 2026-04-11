import { DIFFICULTIES, DEFAULT_ROUNDS } from "./config.js";
import { createWordQueue } from "./wordEngine.js";

export function createGame({ teams, difficulty, rounds = DEFAULT_ROUNDS }) {
  const cfg = DIFFICULTIES[difficulty];

  return {
    teams:            teams.map((name, i) => ({ id: i, name, score: 0 })),
    difficulty,
    rounds,
    totalRounds:      rounds,
    currentTeamIndex: 0,
    wordQueue:        createWordQueue(cfg.wordSet),
    phase:            "ready",
    currentWord:      null,
    lastGuessed:      null,
    roundWords:       [],
  };
}

export function getCurrentTeam(state) {
  return state.teams[state.currentTeamIndex];
}

export function nextWord(state) {
  if (state.wordQueue.isEmpty()) {
    state.wordQueue = createWordQueue(DIFFICULTIES[state.difficulty].wordSet);
  }

  if (state.difficulty === "mixed") {
    const currentLevel = state.currentWord?.level ?? 1;

    let targetLevel;
    if (state.lastGuessed === null) {
      targetLevel = 1;
    } else if (state.lastGuessed) {
      targetLevel = Math.min(currentLevel + 1, 3);
    } else {
      targetLevel = Math.max(currentLevel - 1, 1);
    }
    state.currentWord = state.wordQueue.dequeueByLevel(targetLevel);
  } else {
    state.currentWord = state.wordQueue.dequeue("oldest");
  }

  return state.currentWord;
}

export function markWord(state, guessed) {
  state.roundWords.push({ word: state.currentWord, guessed });
  state.lastGuessed = guessed;
  if (guessed) {
    getCurrentTeam(state).score++;
  } else {
    getCurrentTeam(state).score--;
  }
}

export function endRound(state) {
  const result = {
    team:  getCurrentTeam(state),
    words: [...state.roundWords],
    score: getCurrentTeam(state).score,
  };

  state.roundWords       = [];
  state.lastGuessed = null;
  state.phase            = "roundEnd";
  state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;

  if (state.currentTeamIndex === 0) state.rounds--;
  if (state.rounds <= 0) state.phase = "gameOver";

  return result;
}

export function getWinner(state) {
  return [...state.teams].sort((a, b) => b.score - a.score)[0];
}