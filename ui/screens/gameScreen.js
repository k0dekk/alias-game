import { render, $, on, fadeIn } from "../../ui/render.js";
import { Timer } from "../../game/timer.js";
import { t } from "../../utils/i18n.js";
import {
  getCurrentTeam, nextWord, markWord, endRound,
} from "../../game/gameState.js";
import { applyLayout } from "../../ui/layout.js";
import { showRoundEndScreen } from "./resultScreen.js";
import { auth } from "../../utils/firebase.js";

import "../../styles/pages/game-play.css";

let timer = null;
let readyCleanup = null;

const ICON_ARROW_LEFT = `<svg class="game-btn__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`;
const ICON_ARROW_RIGHT = `<svg class="game-btn__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
const ICON_PAUSE = `<svg class="game-pause__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1"/><rect x="14" y="4" width="5" height="16" rx="1"/></svg>`;
const ICON_PLAY = `<svg class="game-pause__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;

export function showReadyScreen(state, onRoundStart) {
  if (readyCleanup) {
    readyCleanup();
    readyCleanup = null;
  }

  applyLayout("contained");
  const team = getCurrentTeam(state);
  const R = 52;
  const C = 2 * Math.PI * R;

  render(`
    <section class="game-ready settings-card game-ready--countdown">
      <p class="game-ready__meta">${t(`difficulties.${state.difficulty}`)} · ${t("gameScreen.targetPoints", { n: state.targetScore })} · ${state.roundTimeSec} ${t("gameScreen.secondsShort")}</p>
      <p class="game-ready__round">${t("gameScreen.roundSession", { n: state.roundsPlayed + 1 })}</p>
      <h2 class="game-ready__team">${team.name}</h2>
      <p class="game-ready__hint">${t("gameScreen.passDevice")}</p>
      <div class="game-ready__scores">
        ${state.teams.map(teamItem => `
          <span class="game-ready__scoreline">${teamItem.name}: ${teamItem.score} ${t("gameScreen.pointsShort")}</span>
        `).join("")}
      </div>
      <div class="game-ready__countdown" aria-live="polite">
        <svg class="game-ready__ring" viewBox="0 0 120 120" width="200" height="200">
          <circle class="game-ready__ring-bg" cx="60" cy="60" r="${R}" fill="none" stroke-width="10" />
          <circle class="game-ready__ring-fg" id="countdownRing" cx="60" cy="60" r="${R}" fill="none" stroke-width="10"
            stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 60 60)" />
        </svg>
        <span class="game-ready__count-num" id="countdownNum">5</span>
      </div>
    </section>
  `);

  fadeIn();

  const ring = $("#countdownRing");
  const numEl = $("#countdownNum");
  const DURATION_MS = 5000;
  let raf = 0;
  let cancelled = false;

  function tick(now, start) {
    if (cancelled) return;
    const elapsed = Math.min(DURATION_MS, now - start);
    const progress = elapsed / DURATION_MS;
    const remainingSec = (DURATION_MS - elapsed) / 1000;
    const displayNum = Math.min(5, Math.max(1, Math.ceil(remainingSec)));
    if (numEl) numEl.textContent = String(displayNum);
    if (ring) ring.style.strokeDashoffset = String(C * (1 - progress));

    if (elapsed >= DURATION_MS) {
      state.phase = "playing";
      onRoundStart();
      return;
    }
    raf = requestAnimationFrame((t) => tick(t, start));
  }

  raf = requestAnimationFrame((t) => tick(t, t));

  readyCleanup = () => {
    cancelled = true;
    if (raf) cancelAnimationFrame(raf);
  };
}

function wordLabel(word) {
  if (!word) return "";
  return typeof word === "object" && word.text != null ? word.text : String(word);
}

export function showGameScreen(state, onRoundEnd) {
  stopTimer();
  if (readyCleanup) {
    readyCleanup();
    readyCleanup = null;
  }

  if (state.phase === "ready") {
    return showReadyScreen(state, () => {
      onRoundEnd();
    });
  }

  if (state.phase === "roundEnd") {
    if (!state.lastRoundResult) {
      state.phase = "ready";
      onRoundEnd();
      return;
    }
    return showRoundEndScreen(state, state.lastRoundResult, () => {
      if (state.winReached) {
        onRoundEnd({ goFinal: true });
        return;
      }
      state.phase = "ready";
      onRoundEnd();
    });
  }

  return showActiveRound(state, onRoundEnd);
}

function showActiveRound(state, onRoundEnd) {
  applyLayout("contained");
  const team = getCurrentTeam(state);
  const word = nextWord(state);

  // Якшо словник виявився порожнім одразу на старті
  if (!word || state.phase === "finished") {
    stopTimer();
    if (typeof onRoundEnd === "function") {
      onRoundEnd({ goFinal: true }); 
    }
    return;
  }

  render(`
    <button type="button" class="btn-home-floating" id="btnHome" aria-label="Home">🏠 ${t("gameScreen.home")}</button>
    <div class="game-play container" id="gamePlayRoot">
      <div class="game-play__pause-scrim" id="pauseScrim" hidden></div>
      <div class="game-play__top">
        <span class="game-play__team">${team.name}</span>
        <span class="game-play__stat"><span id="timerVal">${state.roundTimeSec}</span> ${t("gameScreen.secondsShort")}</span>
        <span class="game-play__stat"><span id="roundScore">0</span> ${t("gameScreen.pointsShort")}</span>
      </div>
      <div class="game-play__word-wrap" id="wordWrap">
        <h1 class="game-play__word" id="wordText"><span class="game-play__word-inner" id="wordInner">${wordLabel(word)}</span></h1>
      </div>
      <div class="game-play__actions">
        <button type="button" class="game-btn game-btn--correct" id="btnCorrect" aria-label="${t("gameScreen.correct")}">
          <span class="game-btn__icon" aria-hidden="true">${ICON_ARROW_LEFT}</span>
          <span class="game-btn__label">${t("gameScreen.correct")}</span>
        </button>
  
        <button type="button" class="game-btn game-btn--wrong" id="btnWrong" aria-label="${t("gameScreen.skip")}">
          <span class="game-btn__label">${t("gameScreen.skip")}</span>
          <span class="game-btn__icon" aria-hidden="true">${ICON_ARROW_RIGHT}</span>
        </button>
      </div>
      <div class="game-play__list" id="guessedList"></div>
      <div class="game-play__bottom">
        <button type="button" class="game-pause" id="btnPause" aria-pressed="false" aria-label="${t("gameScreen.pause")}">
          <span class="game-pause__icon" id="pauseIconSlot">${ICON_PAUSE}</span>
          <span class="game-pause__text" id="pauseLabel">${t("gameScreen.pause")}</span>
        </button>
      </div>
    </div>
  `);

  fadeIn();

  let roundScore = 0;
  let paused = false;
  const root = $("#gamePlayRoot");
  const scrim = $("#pauseScrim");
  const btnPause = $("#btnPause");
  const pauseIconSlot = $("#pauseIconSlot");
  const pauseLabel = $("#pauseLabel");

  function setPaused(p) {
    paused = p;
    if (!root) return;
    root.classList.toggle("is-paused", p);
    if (scrim) scrim.hidden = !p;
    if (btnPause) btnPause.setAttribute("aria-pressed", p ? "true" : "false");
    if (pauseLabel) pauseLabel.textContent = p ? t("gameScreen.resume") : t("gameScreen.pause");
    if (pauseIconSlot) pauseIconSlot.innerHTML = p ? ICON_PLAY : ICON_PAUSE;
    if (timer) {
      if (p) timer.pause();
      else timer.resume();
    }
  }

  function updateWord() {
    const w = nextWord(state);
    
    // якшо гравець клікнув по останньому слову, і слів більше нема
    if (!w || state.phase === "finished") {
      stopTimer();
      endRound(state, auth.currentUser?.uid || null);
      if (typeof onRoundEnd === "function") {
        onRoundEnd({ goFinal: true });
      }
      return;
    }
    const inner = $("#wordInner");
    if (inner) inner.textContent = wordLabel(w);
  }

  function addToList(word, guessed) {
    const list = $("#guessedList");
    const item = document.createElement("div");
    item.className = `game-play__guess ${guessed ? "is-hit" : "is-miss"}`;
    item.textContent = `${guessed ? "✓" : "✗"} ${wordLabel(word)}`;
    list.prepend(item);
  }

  function runWordFeedback(direction, onDone) {
    const wrap = $("#wordWrap");
    const inner = $("#wordInner");
    if (!wrap || !inner) {
      onDone();
      return;
    }
    const flashClass = direction === "left" ? "is-flash-green" : "is-flash-red";
    const swipeClass = direction === "left" ? "is-swipe-left" : "is-swipe-right";
    wrap.classList.add(flashClass);
    inner.classList.add(swipeClass);
    const done = () => {
      inner.removeEventListener("animationend", done);
      wrap.classList.remove(flashClass);
      inner.classList.remove(swipeClass);
      void inner.offsetWidth;
      onDone();
    };
    inner.addEventListener("animationend", done, { once: true });
  }

  on("#btnCorrect", "click", () => {
    if (paused) return;
    runWordFeedback("left", () => {
      markWord(state, true);
      roundScore++;
      const rs = $("#roundScore");
      if (rs) rs.textContent = roundScore;
      addToList(state.currentWord, true);
      updateWord();
    });
  });

  on("#btnWrong", "click", () => {
    if (paused) return;
    runWordFeedback("right", () => {
      markWord(state, false);
      roundScore--;
      const rs = $("#roundScore");
      if (rs) rs.textContent = roundScore;
      addToList(state.currentWord, false);
      updateWord();
    });
  });

  on("#btnHome", "click", () => {
    stopTimer();
    window.location.reload();
  });

  timer = new Timer(
    state.roundTimeSec,
    (rem) => {
      const el = $("#timerVal");
      if (el) el.textContent = rem;
    },
    () => {
      endRound(state, auth.currentUser?.uid || null);
      onRoundEnd();
    }
  );
  timer.start();

  on("#btnPause", "click", () => {
    setPaused(!paused);
  });
}

export function stopTimer() {
  if (timer) { timer.stop(); timer = null; }
  if (readyCleanup) {
    readyCleanup();
    readyCleanup = null;
  }
}