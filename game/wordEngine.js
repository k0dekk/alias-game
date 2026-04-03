import wordsData from "../words/uk.json";
import { BiDirectionalPriorityQueue } from "../utils/BiDIrectionalPriorityQueue.js";

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createWordQueue(wordSet) {
  const queue = new BiDirectionalPriorityQueue();

  let filtered;
  if (wordSet === "all") {
    filtered = wordsData;
  } else {
    const difficultyMap = { easy: 1, medium: 2, hard: 3 };
    filtered = wordsData.filter(w => w.level === difficultyMap[wordSet]);
  }

  const shuffled = shuffle(filtered);

  shuffled.forEach(w => {
    console.log(w);
    queue.enqueue(w.text, w.level);
  });

  return queue;
}
