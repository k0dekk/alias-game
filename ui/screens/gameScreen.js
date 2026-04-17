import { render, $, on, fadeIn } from "../render.js";
import { Timer } from "../../game/timer.js";
import { DIFFICULTIES } from "../../game/config.js";
import { t } from "../../utils/i18n.js";
import {
  getCurrentTeam, nextWord, markWord, endRound,
} from "../../game/gameState.js";

let timer = null;

export function showReadyScreen(state, onRoundStart) {
  const team = getCurrentTeam(state);
  const roundNum = state.totalRounds - state.rounds + 1;

  render(`
    <div>
      <p>${t(`difficulties.${state.difficulty}`)}</p>
      <p>${t("gameScreen.round", { current: roundNum, total: state.totalRounds })}</p>
      <h2>${team.name}</h2>
      <p>${t("gameScreen.passDevice")}</p>
      <div>
        ${state.teams.map(teamItem => `
          <span>${teamItem.name}: ${teamItem.score} ${t("gameScreen.pointsShort")}</span><br>
        `).join("")}
      </div>
      <br>
      <button id="readyBtn">${t("settingsScreen.begin")}!</button>
    </div>
  `);

  fadeIn();
  on("#readyBtn", "click", onRoundStart);
}

export function showGameScreen(state, onRoundEnd) {
  const cfg  = DIFFICULTIES[state.difficulty];
  const team = getCurrentTeam(state);
  const word = nextWord(state);

  render(`
    <div>
      <p>${team.name} | <span id="timerVal">${cfg.time}</span> ${t("gameScreen.secondsShort")} | <span id="roundScore">0</span> ${t("gameScreen.pointsShort")}</p>
      <hr>
      <h1 id="wordText">${word.text}</h1>
      <hr>
      <div class="btn-row">
      <button id="btnCorrect">${t("gameScreen.correct")}</button>
      &nbsp;
      <button id="btnWrong">${t("gameScreen.skip")}</button>
      </div>
      <hr>
      <div id="guessedList"></div>
    </div>
  `);

  fadeIn();

  let roundScore = 0;

  function updateWord() {
    const w = nextWord(state);
    $("#wordText").textContent = w.text;
  }

  function addToList(word, guessed) {
    const list = $("#guessedList");
    const item = document.createElement("div");
    item.textContent = `${guessed ? "✓" : "✗"} ${word.text}`;
    list.prepend(item);
  }

  on("#btnCorrect", "click", () => {
    markWord(state, true);
    roundScore++;
    $("#roundScore").textContent = roundScore;
    addToList(state.currentWord, true);
    updateWord();
  });

  on("#btnWrong", "click", () => {
    markWord(state, false);
    roundScore--;
    $("#roundScore").textContent = roundScore;
    addToList(state.currentWord, false);
    updateWord();
  });

  timer = new Timer(
    cfg.time,
    (rem) => {
      $("#timerVal").textContent = rem;
    },
    () => {
      const result = endRound(state);
      onRoundEnd(result);
    }
  );
  timer.start();
}

export function stopTimer() {
  if (timer) { timer.stop(); timer = null; }
}
