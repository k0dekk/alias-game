import { render, on, fadeIn } from "../render.js";
import { getWinner } from "../../game/gameState.js";
import { t } from "../../utils/i18n.js";

export function showRoundEndScreen(state, result, onNext) {
  const isGameOver = state.phase === "gameOver";

  render(`
    <div>
      <h2>${isGameOver ? t("resultScreen.gameOver") : t("resultScreen.timeOver")}</h2>
      <p>${t("resultScreen.team")} <strong>${result.team.name}</strong></p>
      <p>${t("resultScreen.totalScore")} <strong>${result.team.score}</strong></p>

      <h3>${t("resultScreen.roundWords")}</h3>
      ${result.words.map(w => `
        <div>${w.guessed ? "✓" : "✗"} ${w.word}</div>
      `).join("") || `<p>${t("resultScreen.noWords")}</p>`}

      <hr>
      <h3>${t("resultScreen.scoreboard")}</h3>
      ${[...state.teams]
        .sort((a, b) => b.score - a.score)
        .map((team, i) => `<div>${i + 1}. ${team.name} — ${team.score} ${t("gameScreen.pointsShort")}</div>`)
        .join("")}

      <hr>
      <button id="nextBtn">${isGameOver ? t("resultScreen.newGame") : t("resultScreen.nextTeam")}</button>
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
      <h1>${t("resultScreen.finalTitle")}</h1>
      <h2>${t("resultScreen.winner", { name: winner.name })}</h2>
      <p>${winner.score} ${t("gameScreen.pointsShort")}</p>
      <hr>
      <h3>${t("resultScreen.summary")}</h3>
      ${sorted.map((teamItem, i) => `
        <div>${["1","2","3"][i] || (i+1)+"."} ${teamItem.name} — ${teamItem.score} ${t("gameScreen.pointsShort")}</div>
      `).join("")}
      <hr>
      <button id="restartBtn">${t("resultScreen.playAgain")}</button>
    </div>
  `);

  fadeIn();
  on("#restartBtn", "click", onRestart);
}
