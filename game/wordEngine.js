import { PriorityWordQueue } from "../utils/PriorityWordQueue.js";
import { getWords } from "../utils/i18n.js";

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createWordQueue(wordSet, selectedCategories) {
  const queue = new PriorityWordQueue();
  const difficultyMap = { easy: 1, medium: 2, hard: 3 };
  const wordsData = getWords();

  const difficultyFiltered = wordSet === "all"
    ? wordsData
    : wordsData.filter(w => w.level === difficultyMap[wordSet]);

  const filtered = Array.isArray(selectedCategories) && selectedCategories.length > 0
    ? difficultyFiltered.filter(w => selectedCategories.includes(w.category))
    : difficultyFiltered;

  shuffle(filtered).forEach(w => queue.enqueue(w, w.level));

  return queue;
}