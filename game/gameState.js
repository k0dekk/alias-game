import { DIFFICULTIES, CATEGORIES } from "./config.js";
import { createWordQueue } from "./wordEngine.js";
import { saveRoundStats } from "../utils/userProfile.js";
import { log } from "../utils/logger/logger.js";

export const createGame = log({ level: "INFO" })(
  function createGame({
    teams,
    difficulty,
    selectedCategories = [],
    targetScore = 30,
    roundTime = 60,
    customWords = null,
    customCategoryName = null 
  }) {
    const cfg = DIFFICULTIES[difficulty];
    const categoriesToUse = selectedCategories.length > 0
      ? selectedCategories
      : CATEGORIES.map(c => c.id);

    const ts = Math.min(200, Math.max(5, Number(targetScore) || 30));
    const rt = Math.min(300, Math.max(15, Number(roundTime) || 60));

    let finalWordQueue;

    if (customWords && customWords.length > 0) {
      const filteredCustom = customWords
        .filter(w => difficulty === 'all' || w.difficulty === difficulty)
        .map(w => w.word);
      
      const shuffled = filteredCustom.sort(() => Math.random() - 0.5);

      finalWordQueue = {
        items: shuffled,
        isEmpty: function() { return this.items.length === 0; },
        dequeue: function() { return this.items.shift(); },
        enqueue: function(item) { this.items.push(item); },
        peek: function() { return this.items[0]; }
      };

      if (finalWordQueue.items.length === 0) {
        finalWordQueue = createWordQueue(cfg.wordSet, categoriesToUse);
      }
    } else {
      finalWordQueue = createWordQueue(cfg.wordSet, categoriesToUse);
    }

    return {
      teams: teams.map((name, i) => ({ id: i, name, score: 0 })),
      difficulty,
      selectedCategories: categoriesToUse,
      targetScore: ts,
      roundTimeSec: rt,
      roundsPlayed: 0,
      currentTeamIndex: 0,
      
      wordQueue: finalWordQueue, 
      customCategoryName,

      phase: "ready",
      currentWord: null,
      lastGuessed: null,
      roundWords: [],
      lastRoundResult: null,
      winReached: false,
    };
  }
);

export function getCurrentTeam(state) {
  return state.teams[state.currentTeamIndex];
}

export function nextWord(state) {
  if (state.wordQueue.isEmpty()) {
    state.currentWord = null;
    state.winReached = true;
    state.phase = "finished";
    return null;
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
    
    if (typeof state.wordQueue.dequeueByLevel === "function") {
      state.currentWord = state.wordQueue.dequeueByLevel(targetLevel);
    } else {
      state.currentWord = state.wordQueue.dequeue();
    }
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

export function endRound(state, userId = null) {
  const playingTeam = getCurrentTeam(state);
  
  const guessedCount = state.roundWords.filter(w => w.guessed === true).length;
  const skippedCount = state.roundWords.filter(w => w.guessed === false).length;

  if (userId && typeof userId === "string") {
    try {
      saveRoundStats(userId, guessedCount, skippedCount).catch(err => {
        console.error("[Firebase Stats Error] Помилка промісу:", err);
      });
    } catch (firebaseErr) {
      console.error("[Firebase Stats Error] Критична помилка збереження:", firebaseErr);
    }
  }

  const result = {
    team: playingTeam,
    words: [...state.roundWords],
    score: playingTeam.score,
  };

  state.lastRoundResult = result;
  state.roundWords = [];
  state.lastGuessed = null;
  state.roundsPlayed++;

  const maxScore = Math.max(...state.teams.map(t => t.score));
  state.winReached = maxScore >= state.targetScore;

  state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;

  state.phase = "roundEnd";

  return result;
}

export function getWinner(state) {
  return [...state.teams].sort((a, b) => b.score - a.score)[0];
}
