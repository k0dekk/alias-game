import { render, $, $$, on, fadeIn } from "../render.js";
import { DIFFICULTIES, CATEGORIES, MIN_TEAMS, MAX_TEAMS } from "../../game/config.js";
import { t } from "../../utils/i18n.js";

export function showSettingsScreen(onStart) {
  let selectedDifficulty = "medium";
  let teamCount = 2;
  const teamNames = [t("settingsScreen.teamPlaceholder", { number: 1 }), t("settingsScreen.teamPlaceholder", { number: 2 })];
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
      .map(c => t(`categories.${c.id}`))
      .join(", ");
    
    render(`
      <div>
        <h1>${t("settingsScreen.title")}</h1>
        <hr>

        <h3>${t("settingsScreen.difficulty")}</h3>
        ${Object.entries(DIFFICULTIES).map(([key]) => `
          <button class="diff-btn ${key === selectedDifficulty ? "active" : ""}"
                  data-key="${key}">
            ${t(`difficulties.${key}`)}
          </button>
        `).join(" ")}

        <hr>
        <h3>${t("settingsScreen.teamCount")}</h3>
        <button id="teamMinus">−</button>
        <span id="teamCountVal">${teamCount}</span>
        <button id="teamPlus">+</button>

        <div id="teamNames">
          ${renderTeamInputs(teamCount, teamNames)}
        </div>

        <hr>
        <h3>${t("settingsScreen.categories")}</h3>
        <button id="openCategoriesBtn">${selectedLabels || t("settingsScreen.categoriesPlaceholder")}</button>

        <h3>${t("settingsScreen.targetScore")}</h3>
        <input id="targetScoreInput" type="number" min="1" value="${targetScore}" disabled />

        <h3>${t("settingsScreen.roundTime")}</h3>
        <input id="roundTimeInput" type="number" min="10" value="${roundTime}" disabled />

        <hr>
        <button id="beginGameBtn">${t("settingsScreen.begin")}</button>
      </div>

      ${isModalOpen ? `
        <div class="modal-overlay" id="catModal">
          <div class="modal-content">
            <h2>${t("settingsScreen.modalTitle")}</h2>
            <div class="categories-grid">
              ${CATEGORIES.map(c => `
                <div class="cat-box ${tempSelectedCategories.includes(c.id) ? "selected" : ""}" data-id="${c.id}">
                  ${t(`categories.${c.id}`)}
                </div>
              `).join("")}
            </div>
            <div class="modal-actions">
              <button id="cancelCatBtn">${t("settingsScreen.cancel")}</button>
              <button id="confirmCatBtn">${t("settingsScreen.confirm")}</button>
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
               placeholder="${t("settingsScreen.teamPlaceholder", { number: i + 1 })}"
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
        if (!teamNames[teamCount - 1]) teamNames[teamCount - 1] = t("settingsScreen.teamPlaceholder", { number: teamCount });
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
        teamNames[i]?.trim() || t("settingsScreen.teamPlaceholder", { number: i + 1 })
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
