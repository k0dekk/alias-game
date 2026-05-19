import { render, on, fadeIn } from "../../ui/render.js";
import { getWinner } from "../../game/gameState.js";
import { t } from "../../utils/i18n.js";
import { applyLayout } from "../../ui/layout.js";
import { auth } from "../../utils/firebase.js";
import { saveRoundStats } from "../../utils/userProfile.js";

import "../../styles/pages/results-screen.css";

function wordLabel(word) {
  if (!word) return "";
  return typeof word === "object" && word.text != null ? word.text : String(word);
}

export function showRoundEndScreen(state, result, onNext) {
  const isFinal = state.winReached;

  render(`
    <section class="result-round settings-card">
      <h2 class="result-round__title">${isFinal ? t("resultScreen.targetReached") : t("resultScreen.timeOver")}</h2>
      <p class="result-round__line">${t("resultScreen.team")} <strong>${result.team.name}</strong></p>
      <p class="result-round__line">${t("resultScreen.totalScore")} <strong>${result.team.score}</strong></p>

      <h3 class="result-round__sub">${t("resultScreen.roundWords")}</h3>
      <div class="result-round__words">
        ${result.words.map(w => `
          <div class="result-round__word ${w.guessed ? "is-hit" : "is-miss"}">${w.guessed ? "✓" : "✗"} ${wordLabel(w.word)}</div>
        `).join("") || `<p class="result-round__empty">${t("resultScreen.noWords")}</p>`}
      </div>

      <h3 class="result-round__sub">${t("resultScreen.scoreboard")}</h3>
      <div class="result-round__board">
        ${[...state.teams]
          .sort((a, b) => b.score - a.score)
          .map((team, i) => `<div class="result-round__row">${i + 1}. ${team.name} — ${team.score} ${t("gameScreen.pointsShort")}</div>`)
          .join("")}
      </div>

      <button type="button" class="result-round__next" id="nextBtn">${isFinal ? t("resultScreen.toFinalResults") : t("resultScreen.nextTeam")}</button>
    </section>
  `);

  fadeIn();
  on("#nextBtn", "click", () => {
    onNext();
  });
}

function mountConfettiBurst() {
  const host = document.getElementById("confettiRoot");
  if (!host) return;
  const colors = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c56cf0", "#ffffff", "#ff9f43", "#10ac84"];
  const n = 64;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span");
    p.className = "confetti-piece";
    const x = 6 + Math.random() * 88;
    const delay = Math.random() * 0.2;
    const dur = 1.15 + Math.random() * 0.55;
    const rot = (Math.random() - 0.5) * 1080;
    const w = 5 + Math.random() * 9;
    const h = 7 + Math.random() * 14;
    const tx = (Math.random() - 0.5) * 220;
    const ty = -(55 + Math.random() * 42);
    p.style.left = `${x}%`;
    p.style.width = `${w}px`;
    p.style.height = `${h}px`;
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = `${dur}s`;
    p.style.animationDelay = `${delay}s`;
    p.style.setProperty("--rot", `${rot}deg`);
    p.style.setProperty("--tx", `${tx}px`);
    p.style.setProperty("--ty", `${ty}vh`);
    host.appendChild(p);
  }
}

export function showGameOverScreen(state, onRestart) {
  applyLayout("contained");
  const winner = getWinner(state);
  const sorted = [...state.teams].sort((a, b) => b.score - a.score);

  render(`
    <div class="final-screen-wrap">
      <div class="confetti-root" id="confettiRoot" aria-hidden="true"></div>
      <section class="final-screen">
        <div class="final-screen__hero">
          <h1 class="final-screen__title">${t("resultScreen.finalTitle")}</h1>
          <p class="final-screen__subtitle">${t("resultScreen.finalSubtitle", { n: state.targetScore })}</p>
        </div>

        <div class="final-screen__card final-screen__winner-card">
          <div class="final-screen__trophy" aria-hidden="true">🏆</div>
          <h2 class="final-screen__winner-name">${t("resultScreen.winner", { name: winner.name })}</h2>
          <p class="final-screen__winner-score">${winner.score} ${t("gameScreen.pointsShort")}</p>
        </div>

        <div class="final-screen__card">
          <h3 class="final-screen__section-title">${t("resultScreen.summary")}</h3>
          <ol class="final-screen__podium">
            ${sorted.map((teamItem, i) => `
              <li class="final-screen__team-row rank-${i + 1}">
                <span class="final-screen__rank">${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}</span>
                <span class="final-screen__tname">${teamItem.name}</span>
                <span class="final-screen__tscore">${teamItem.score} ${t("gameScreen.pointsShort")}</span>
              </li>
            `).join("")}
          </ol>
        </div>

        <button type="button" class="final-screen__cta" id="restartBtn">${t("resultScreen.playAgain")}</button>
      </section>
    </div>
  `);

  fadeIn();
  requestAnimationFrame(() => mountConfettiBurst());
  on("#restartBtn", "click", onRestart);
}
