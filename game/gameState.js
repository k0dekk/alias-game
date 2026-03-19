import { DIFFICULTIES, DEFAULT_ROUNDS } from "./config.js";
import { createWordQueue } from "./wordEngine.js";

export function createGame({ teams, difficulty, rounds = DEFAULT_ROUNDS }) {
  const cfg = DIFFICULTIES[difficulty];

  return {
    teams:      teams.map((name, i) => ({ id: i, name, score: 0 })),
    difficulty,
    rounds,
    totalRounds: rounds,
    currentTeamIndex: 0,
    wordQueue: createWordQueue(cfg.wordSet),
    wordIndex: 0,
    phase: "ready",
    currentWord: null,
    roundWords: [],
  };
}

export function getCurrentTeam(state) {
  return state.teams[state.currentTeamIndex];
}

export function nextWord(state) {
  if (state.wordIndex >= state.wordQueue.length) {
    state.wordQueue = createWordQueue(DIFFICULTIES[state.difficulty].wordSet);
    state.wordIndex = 0;
  }
  state.currentWord = state.wordQueue[state.wordIndex++];
  return state.currentWord;
}

export function markWord(state, guessed) {
  state.roundWords.push({ word: state.currentWord, guessed });
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

  state.roundWords = [];
  state.phase = "roundEnd";
  state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;

  if (state.currentTeamIndex === 0) state.rounds--;
  if (state.rounds <= 0) state.phase = "gameOver";

  return result;
}

export function getWinner(state) {
  return [...state.teams].sort((a, b) => b.score - a.score)[0];
}