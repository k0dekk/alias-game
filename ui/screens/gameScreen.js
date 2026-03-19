import { render, $, on, fadeIn } from "../render.js";
import { Timer } from "../../game/timer.js";
import { DIFFICULTIES } from "../../game/config.js";
import {
  getCurrentTeam, nextWord, markWord, endRound,
} from "../../game/gameState.js";

let timer = null;

export function showReadyScreen(state, onRoundStart) {
  const team = getCurrentTeam(state);
  const cfg  = DIFFICULTIES[state.difficulty];
  const roundNum = state.totalRounds - state.rounds + 1;

  render(`
    <div>
      <p>${cfg.label}</p>
      <p>Раунд ${roundNum} / ${state.totalRounds}</p>
      <h2>${team.name}</h2>
      <p>Передайте пристрій іншій команді.</p>
      <div>
        ${state.teams.map(t => `
          <span>${t.name}: ${t.score} очок</span><br>
        `).join("")}
      </div>
      <br>
      <button id="readyBtn">Почати!</button>
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
      <p>${team.name} | <span id="timerVal">${cfg.time}</span> сек | <span id="roundScore">0</span> очок</p>
      <hr>
      <h1 id="wordText">${word}</h1>
      <hr>
      <button id="btnCorrect">✓ Вгадали!</button>
      &nbsp;
      <button id="btnWrong">✗ Пропустити</button>
      <hr>
      <div id="guessedList"></div>
    </div>
  `);

  fadeIn();

  let roundScore = 0;

  function updateWord() {
    const w = nextWord(state);
    $("#wordText").textContent = w;
  }

  function addToList(word, guessed) {
    const list = $("#guessedList");
    const item = document.createElement("div");
    item.textContent = `${guessed ? "✓" : "✗"} ${word}`;
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
