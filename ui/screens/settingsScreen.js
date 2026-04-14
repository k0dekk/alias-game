import { render, $, $$, on, fadeIn } from "../render.js";
import { DIFFICULTIES, CATEGORIES, MIN_TEAMS, MAX_TEAMS } from "../../game/config.js";

export function showSettingsScreen(onStart) {
  let selectedDifficulty = "medium";
  let teamCount = 2;
  const teamNames = ["Команда 1", "Команда 2"];
  let selectedCategory = "all";
  let targetScore = 30;
  let roundTime = 60;

  let selectedCategories = ["all"];
  let tempSelectedCategories = [];
  let isModalOpen = false;

  renderPage();

  function renderPage() {
    const selectedLabels = CATEGORIES
      .filter(c => selectedCategories.includes(c.id))
      .map(c => c.label)
      .join(", ");
    
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
        <button id="openCategoriesBtn">${selectedLabels || "Категорії"}</button>

        <h3>Бали для перемоги:</h3>
        <input id="targetScoreInput" type="number" min="1" value="${targetScore}" disabled />

        <h3>Час раунду:</h3>
        <input id="roundTimeInput" type="number" min="10" value="${roundTime}" disabled />

        <hr>
        <button id="beginGameBtn">Почати</button>
      </div>

      ${isModalOpen ? `
        <div class="modal-overlay" id="catModal">
          <div class="modal-content">
            <h2>Обери категорії</h2>
            <div class="categories-grid">
              ${CATEGORIES.map(c => `
                <div class="cat-box ${tempSelectedCategories.includes(c.id) ? "selected" : ""}" data-id="${c.id}">
                  ${c.label}
                </div>
              `).join("")}
            </div>
            <div class="modal-actions">
              <button id="cancelCatBtn">Скасувати</button>
              <button id="confirmCatBtn">Обрати</button>
            </div>
          </div>
        </div>
      ` : ""}
      
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

    on("#openCategoriesBtn", "click", () => {
      isModalOpen = true;
      tempSelectedCategories = [...selectedCategories]; 
      renderPage();
    });

    if (isModalOpen) {
      $$(".cat-box").forEach(box => {
        on(box, "click", () => {
          const id = box.dataset.id;
          if (tempSelectedCategories.includes(id)) {
            tempSelectedCategories = tempSelectedCategories.filter(cat => cat !== id);
          } else {
            tempSelectedCategories.push(id);
          }
          renderPage();
        });
      });

      on("#cancelCatBtn", "click", () => {
        isModalOpen = false;
        renderPage();
      });

      on("#confirmCatBtn", "click", () => {
        selectedCategories = [...tempSelectedCategories];
        isModalOpen = false;
        renderPage();
      });
    }

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
