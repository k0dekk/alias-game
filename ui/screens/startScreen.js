import { render, $, $$, on, fadeIn } from "../render.js";
import { DIFFICULTIES, MIN_TEAMS, MAX_TEAMS } from "../../game/config.js";

export function showStartScreen(onStart) {
  let selectedDifficulty = "medium";
  let teamCount = 2;
  const teamNames = ["Команда 1", "Команда 2"];

  renderPage();

  function renderPage() {
    render(`
      <div>
        <h1>ALIAS</h1>
        <hr>

        <h3>Складність:</h3>
        ${Object.entries(DIFFICULTIES).map(([key, d]) => `
          <button class="diff-btn ${key === selectedDifficulty ? "[активний]" : ""}"
                  data-key="${key}">
            ${d.label} (${d.time}с)
          </button>
        `).join(" ")}

        <hr>
        <h3>Кількість команд:</h3>
        <button id="teamMinus">−</button>
        <span id="teamCountVal">${teamCount}</span>
        <button id="teamPlus">+</button>

        <div id="teamNames">
          ${renderTeamInputs(teamCount, teamNames)}
        </div>

        <hr>
        <button id="startBtn">Почати гру</button>
      </div>
    `);

    fadeIn();
    attachEvents();
  }

  function renderTeamInputs(count, names) {
    return Array.from({ length: count }, (_, i) => `
      <div>
        <label>${i + 1}. </label>
        <input class="team-input" type="text"
               placeholder="Команда ${i + 1}"
               value="${names[i] || ""}"
               data-idx="${i}" maxlength="20"/>
      </div>
    `).join("");
  }

  function attachEvents() {
    $$(".diff-btn").forEach(btn => {
      on(btn, "click", () => {
        selectedDifficulty = btn.dataset.key;
        renderPage();
      });
    });

    on("#teamMinus", "click", () => {
      if (teamCount > MIN_TEAMS) { teamCount--; renderPage(); }
    });
    on("#teamPlus", "click", () => {
      if (teamCount < MAX_TEAMS) {
        teamCount++;
        if (!teamNames[teamCount - 1]) teamNames[teamCount - 1] = `Команда ${teamCount}`;
        renderPage();
      }
    });

    on("#teamNames", "input", e => {
      if (e.target.classList.contains("team-input")) {
        teamNames[+e.target.dataset.idx] = e.target.value;
      }
    });

    on("#startBtn", "click", () => {
      const names = Array.from({ length: teamCount }, (_, i) =>
        teamNames[i]?.trim() || `Команда ${i + 1}`
      );
      onStart({ teams: names, difficulty: selectedDifficulty });
    });
  }
}
