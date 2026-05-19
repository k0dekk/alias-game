import { t, getLanguage } from "../../utils/i18n.js";

/**
 * @param {object} props
 * @param {object}   props.difficulties
 * @param {string}  props.selectedDifficulty
 * @param {number}   props.teamCount
 * @param {Array<{name:string, colorHex:string}>} props.teamConfigs
 * @param {string[]} props.selectedCategories
 * @param {object[]} props.categories
 * @param {object[]} props.customCategories
 * @param {boolean}  props.isModalOpen
 * @param {string[]} props.tempSelectedCategories
 * @param {number}  props.targetScore
 * @param {number}   props.roundTime
 */

export function settingsScreenMarkup({
  difficulties,
  selectedDifficulty,
  teamCount,
  teamConfigs,
  selectedCategories,
  categories,
  customCategories = [],
  isModalOpen,
  tempSelectedCategories,
  targetScore,
  roundTime,
}) {
  const categoryButtonText = getSelectedCategoryLabels(
    selectedCategories,
    categories,
    customCategories,
  );

  return `
    <section class="settings-screen">
      <header class="header">
        <button class="settings-back-btn" id="settingsBackBtn" type="button"
                aria-label="${t("settingsScreen.back")}">
          <span aria-hidden="true">←</span>
          <span>${t("settingsScreen.back")}</span>
        </button>
        <h1 class="settings-title">${t("settingsScreen.title")}</h1>
      </header>

      <main class="settings-main">
        <div class="settings-card">

          <!-- Difficulty -->
          <section>
            <p class="settings-label">${t("settingsScreen.difficulty")}</p>
            <div class="difficulty-track ${selectedDifficulty}" id="diffTrack">
              <button class="diff-arrow" id="diffPrev" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"
                     stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <div class="diff-label-wrap">
                <span class="diff-label ${selectedDifficulty}" id="diffLabel">
                  ${t(`difficulties.${selectedDifficulty}`)}
                </span>
              </div>
              <button class="diff-arrow" id="diffNext" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"
                     stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </section>

          <hr class="settings-divider">

          <!-- Categories -->
          <section>
            <div>
              <p class="settings-label">${t("settingsScreen.categories")}</p>
              <button class="categories-btn" id="openCategoriesBtn" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                     stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3"  y="3"  width="7" height="7" rx="1.5"/>
                  <rect x="14" y="3"  width="7" height="7" rx="1.5"/>
                  <rect x="3"  y="14" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                </svg>
                <span id="categoriesBtnText">${categoryButtonText}</span>
              </button>
            </div>
          </section>

          <hr class="settings-divider">

          <!-- Teams -->
          <section>
            <div class="teams-header">
              <p class="settings-label">${t("settingsScreen.teamCount")}</p>
              <div class="counter">
                <button class="counter-btn" id="teamMinus" type="button">−</button>
                <button class="counter-btn" id="teamPlus"  type="button">+</button>
              </div>
            </div>
            <div class="teams-list" id="teamNames">
              ${renderTeamInputs(teamCount, teamConfigs)}
            </div>
          </section>

          <hr class="settings-divider">

          <!-- Score & Time -->
          <section class="field-group">
            <div class="field">
              <p class="settings-label">${t("settingsScreen.targetScore")}</p>
              <div class="number-input-wrap">
                <input id="targetScoreInput" class="number-input" type="number"
                       value="${targetScore}" min="5" max="200" step="5" />
                <span class="input-unit">${t("settingsScreen.pointsShort")}</span>
              </div>
            </div>
            <div class="field">
              <p class="settings-label">${t("settingsScreen.roundTime")}</p>
              <div class="number-input-wrap">
                <input id="roundTimeInput" class="number-input" type="number"
                       value="${roundTime}" min="15" max="300" step="5" />
                <span class="input-unit">${t("gameScreen.secondsShort")}</span>
              </div>
            </div>
          </section>

          <!-- Start button -->
          <button class="start-btn" id="beginGameBtn" type="button">
            <svg class="btn-icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff"
                d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12
                   c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12
                   a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z"/>
            </svg>
            <span class="btn-text">${t("settingsScreen.begin")}</span>
          </button>

        </div>
      </main>

      ${isModalOpen
        ? renderCategoriesModal(categories, tempSelectedCategories, customCategories)
        : ""}
    </section>
  `;
}

// хелпери

function getSelectedCategoryLabels(selectedCategories, categories, customCategories) {
  if (selectedCategories.includes("all")) return t("categories.all");
  return selectedCategories
    .map(id => {
      const custom = customCategories.find(c => c.id === id);
      return custom ? custom.name : t(`categories.${id}`);
    })
    .join(", ");
}

function renderTeamInputs(count, configs) {
  return Array.from({ length: count }, (_, i) => {
    const conf = configs?.[i] ?? { name: "", colorHex: "#d87b32" };
    return `
      <div class="team-row">
        <div class="team-number"
             style="background:${conf.colorHex};
                    border-color:${conf.colorHex};
                    color:white;">
          ${i + 1}
        </div>
        <input
          class="team-input"
          type="text"
          placeholder="${t("settingsScreen.teamPlaceholder", { number: i + 1 })}"
          value="${conf.name}"
          data-idx="${i}"
          maxlength="20"
        />
      </div>
    `;
  }).join("");
}

// Categories modal window
function renderCategoriesModal(categories, selected, customCategories) {
  const options = [{ id: "all", name: t("categories.all") }];
  categories.forEach(c => options.push({ id: c.id, name: t(`categories.${c.id}`) }));
  customCategories.forEach(c => options.push({ id: c.id, name: `${c.name} (Своя)` }));

  return `
    <div class="modal-overlay" id="catModal">
      <div class="modal-content settings-modal-content">
        <h2>${t("settingsScreen.modalTitle")}</h2>

        <div class="categories-grid settings-categories-grid">
          ${options.map(c => `
            <button class="cat-box ${selected.includes(c.id) ? "selected" : ""}"
                    data-id="${c.id}" type="button">
              ${c.name}
            </button>
          `).join("")}
        </div>

        <div class="modal-actions">
          <!-- Random roulette — Lab 6 consumeIteratorWithTimeout -->
          <button id="randomCatBtn" class="modal-random-btn" type="button">
            🎲 ${t("settingsScreen.random") ?? "Випадкова"}
          </button>

          <button id="cancelCatBtn"  type="button">${t("settingsScreen.cancel")}</button>
          <button id="confirmCatBtn" type="button">${t("settingsScreen.confirm")}</button>
        </div>
      </div>
    </div>
  `;
}