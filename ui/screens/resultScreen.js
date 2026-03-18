import { render, on, fadeIn } from "../render.js";
import { getWinner } from "../../game/gameState.js";

export function showRoundEndScreen(state, result, onNext) {
  const isGameOver = state.phase === "gameOver";

  render(`
    <div>
      <h2>${isGameOver ? "Кінець гри" : "Час вийшов"}</h2>
      <p>Команда: <strong>${result.team.name}</strong></p>
      <p>Загальний рахунок: <strong>${result.team.score}</strong></p>

      <h3>Слова цього раунду:</h3>
      ${result.words.map(w => `
        <div>${w.guessed ? "✓" : "✗"} ${w.word}</div>
      `).join("") || "<p>Жодного слова</p>"}

      <hr>
      <h3>Рахунок:</h3>
      ${[...state.teams]
        .sort((a, b) => b.score - a.score)
        .map((t, i) => `<div>${i + 1}. ${t.name} — ${t.score} очок</div>`)
        .join("")}

      <hr>
      <button id="nextBtn">${isGameOver ? "Нова гра" : "Наступна команда"}</button>
    </div>
  `);

  fadeIn();
  on("#nextBtn", "click", onNext);
}

export function showGameOverScreen(state, onRestart) {
  const winner = getWinner(state);
  const sorted = [...state.teams].sort((a, b) => b.score - a.score);

  render(`
    <div>
      <h1>🎉 Кінець гри!</h1>
      <h2>Перемагає: ${winner.name}</h2>
      <p>${winner.score} очок</p>
      <hr>
      <h3>Підсумки:</h3>
      ${sorted.map((t, i) => `
        <div>${["1","2","3"][i] || (i+1)+"."} ${t.name} — ${t.score} очок</div>
      `).join("")}
      <hr>
      <button id="restartBtn">Грати знову</button>
    </div>
  `);

  fadeIn();
  on("#restartBtn", "click", onRestart);
}
