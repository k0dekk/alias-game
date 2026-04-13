import { render, $, $$, on, fadeIn } from "../render.js";
import { DIFFICULTIES, MIN_TEAMS, MAX_TEAMS } from "../../game/config.js";

export function showSettingsScreen(onStart) {
  let selectedDifficulty = "medium";
  let teamCount = 2;
  const teamNames = ["Команда 1", "Команда 2"];
  let selectedCategory = "all";
  let targetScore = 30;
  let roundTime = 60;

  renderPage();

  function renderPage() {
    render(`
      <div>
        <h1>Налаштування гри</h1>
        <hr>

        <h3>Складність:</h3>
        ${Object.entries(DIFFICULTIES).map(([key, d]) => `
          <button class="diff-btn ${key === selectedDifficulty ? "active" : ""}"
                  data-key="${key}">
            ${d.label}
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
        <h3>Категорії:</h3>
        <select id="categorySelect" disabled>
        </select>

        <h3>Бали для перемоги:</h3>
        <input id="targetScoreInput" type="number" min="1" value="${targetScore}" disabled />

        <h3>Час раунду:</h3>
        <input id="roundTimeInput" type="number" min="10" value="${roundTime}" disabled />

        <hr>
        <button id="beginGameBtn">Почати</button>
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
      if (teamCount > MIN_TEAMS) {
        teamCount--;
        renderPage();
      }
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

    on("#beginGameBtn", "click", () => {
      const names = Array.from({ length: teamCount }, (_, i) =>
        teamNames[i]?.trim() || `Команда ${i + 1}`
      );

      onStart({
        teams: names,
        difficulty: selectedDifficulty,
        category: selectedCategory,
        targetScore,
        roundTime,
      });
    });
  }
}
