import words, { getAllWords } from "../words/uk.js";

export function getWordPool(wordSet) {
  switch (wordSet) {
    case "easy":   return [...words.easy];
    case "medium": return [...words.medium];
    case "hard":   return [...words.hard];
    case "all":    return getAllWords();
    default:       return getAllWords();
  }
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createWordQueue(wordSet) {
  return shuffle(getWordPool(wordSet));
}