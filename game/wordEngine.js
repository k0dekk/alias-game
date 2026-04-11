import wordsData from "../words/uk.json";
import { PriorityWordQueue } from "../utils/PriorityWordQueue.js";

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createWordQueue(wordSet) {
  const queue = new PriorityWordQueue();
  const difficultyMap = { easy: 1, medium: 2, hard: 3 };

  const filtered = wordSet === "all"
    ? wordsData
    : wordsData.filter(w => w.level === difficultyMap[wordSet]);

  shuffle(filtered).forEach(w => queue.enqueue(w.text, w.level));

  return queue;
}