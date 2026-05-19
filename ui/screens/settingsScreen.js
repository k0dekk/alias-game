import { render, $, $$, on, fadeIn } from "../../ui/render.js";
import { DIFFICULTIES, CATEGORIES, MIN_TEAMS, MAX_TEAMS } from "../../game/config.js";
import { t, getLanguage, onLanguageChange } from "../../utils/i18n.js";
import { applyLayout } from "../../ui/layout.js";
import { settingsScreenMarkup } from "./settingsScreenMarkup.js";
import { startTyping } from "../../ui/typing.js";
import { auth } from "../../utils/firebase.js";
import { getCustomCategories } from "../../utils/proxy/customCategoriesApi.js";
import { roundRobinGenerator, consumeIteratorWithTimeout } from "../../utils/generator/generators.js";
import { asyncSomePromiseAbortable } from "../../utils/asyncSome/asyncSome.js";
import { checkTeamNameValid } from "../../utils/asyncSome/teamValidator.js";

import { pickInstantConfig } from "../../utils/stream/teamStream.js";

import "../../styles/components/header.css";
import "../../styles/base/base.css";
import "../../styles/pages/settings-layout.css";
import "../../styles/pages/settings-difficulty.css";
import "../../styles/pages/settings-controls.css";
import "../../styles/pages/settings-modal.css";

const DEFAULT_SLOT_COLORS = [
  "#E53935", "#1E88E5", "#43A047", "#8E24AA",
  "#FB8C00", "#00ACC1", "#D81B60", "#F9A825",
];

function getLoc(val, lang) {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[lang] || val.uk || val.en || "";
}

export function showSettingsScreen(onStart, onBack) {
  applyLayout('contained', true);

  const difficultyKeys   = Object.keys(DIFFICULTIES);
  let selectedDifficulty = "easy";
  let difficultyIndex    = difficultyKeys.indexOf(selectedDifficulty);

  let teamCount   = 2;
  let teamConfigs = [
    { name: "", colorHex: DEFAULT_SLOT_COLORS[0], isCustom: false, raw: null },
    { name: "", colorHex: DEFAULT_SLOT_COLORS[1], isCustom: false, raw: null },
  ];

  const animatingSlots = new Set();

  let selectedCategories     = ["all"];
  let tempSelectedCategories = ["all"];
  let isModalOpen            = false;
  let isFirstRender          = true;
  let diffAnimating          = false;
  let targetScore            = 30;
  let roundTime              = 60;
  let customCategories       = [];

  function clampTarget(n) { return Math.min(200, Math.max(5, n)); }
  function clampRound(n)  { return Math.min(300, Math.max(15, n)); }

  // Динамічний переклад назв, якщо мова змінилася глобально ззовні
  const unsubscribeLang = onLanguageChange((newLang) => {
    teamConfigs.forEach(conf => {
      if (!conf.isCustom && conf.raw) {
        const a = getLoc(conf.raw.adjective, newLang);
        const n = getLoc(conf.raw.noun, newLang);
        conf.name = `${a} ${n}`.trim();
      }
    });
    renderPage();
  });

  if (auth.currentUser) {
    getCustomCategories(auth.currentUser.uid)
      .then(cats => {
        customCategories = cats;
        if (animatingSlots.size === 0) renderPage();
      })
      .catch(console.error);
  }

  renderPage();
  for (let i = 0; i < teamCount; i++) animateTeamSlot(i);

  function renderPage() {
    render(settingsScreenMarkup({
      difficulties: DIFFICULTIES,
      selectedDifficulty,
      teamCount,
      teamConfigs,
      selectedCategories,
      categories: CATEGORIES,
      customCategories,
      isModalOpen,
      tempSelectedCategories,
      targetScore,
      roundTime,
    }));

    const titleEl   = document.querySelector(".settings-title");
    const titleText = t("settingsScreen.title");

    if (isFirstRender) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => { if (titleEl) startTyping(titleEl, titleText, 90); }, 50);
      isFirstRender = false;
    } else if (titleEl) {
      titleEl.textContent = titleText;
    }

    fadeIn();
    attachEvents();
  }

  const syncNames = () => {
    $$(".team-input").forEach((inp, i) => {
      if (teamConfigs[i] && teamConfigs[i].name !== inp.value) {
        teamConfigs[i].name = inp.value;
        teamConfigs[i].isCustom = true; 
      }
    });
  };

  function animateTeamSlot(slotIndex) {
    if (animatingSlots.has(slotIndex)) return;
    animatingSlots.add(slotIndex);

    let ticks = 0;
    const maxTicks = 6;

    const timer = setInterval(() => {
      if (!animatingSlots.has(slotIndex)) {
        clearInterval(timer);
        return;
      }

      const res = pickInstantConfig(slotIndex);
      const lang = getLanguage();
      const a = getLoc(res.adjective, lang);
      const n = getLoc(res.noun, lang);

      teamConfigs[slotIndex] = {
        raw: res,
        colorHex: res.colorHex,
        name: `${a} ${n}`.trim(),
        isCustom: false
      };

      const inputs = $$(".team-input");
      const badges = $$(".team-number");
      if (inputs[slotIndex]) inputs[slotIndex].value = teamConfigs[slotIndex].name;
      if (badges[slotIndex]) {
        badges[slotIndex].style.background   = teamConfigs[slotIndex].colorHex;
        badges[slotIndex].style.borderColor  = teamConfigs[slotIndex].colorHex;
        badges[slotIndex].style.color        = "#ffffff";
      }

      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(timer);
        animatingSlots.delete(slotIndex);
      }
    }, 40);
  }

  function attachEvents() {
    on("#settingsBackBtn", "click", () => {
      unsubscribeLang();
      animatingSlots.clear();
      if (typeof onBack === "function") onBack();
    });

    function animateDifficultyChange(direction) {
      if (diffAnimating) return;
      diffAnimating = true;

      const wrap     = $(".diff-label-wrap");
      const oldLabel = wrap.querySelector(".diff-label");

      difficultyIndex    = (difficultyIndex + direction + difficultyKeys.length) % difficultyKeys.length;
      selectedDifficulty = difficultyKeys[difficultyIndex];
      const newText      = t(`difficulties.${selectedDifficulty}`);

      if (oldLabel) {
        const exitAnim = direction === 1 ? "slideOutLeft" : "slideOutRight";
        oldLabel.style.animation = `${exitAnim} 0.25s ease forwards`;
        setTimeout(() => { if (oldLabel.parentNode) oldLabel.remove(); }, 250);
      }

      const enterAnim = direction === 1 ? "slideInRight" : "slideInLeft";
      const newLabel  = document.createElement("span");
      newLabel.className       = `diff-label ${selectedDifficulty}`;
      newLabel.textContent     = newText;
      newLabel.style.animation = `${enterAnim} 0.25s ease forwards`;
      wrap.appendChild(newLabel);

      const track = $("#diffTrack");
      if (track) track.className = `difficulty-track ${selectedDifficulty}`;

      setTimeout(() => { diffAnimating = false; }, 250);
    }

    on("#diffPrev", "click", () => animateDifficultyChange(-1));
    on("#diffNext", "click", () => animateDifficultyChange(1));

    on("#teamMinus", "click", () => {
      if (teamCount <= MIN_TEAMS) return;
      syncNames();
      animatingSlots.delete(teamCount - 1);
      teamCount--;
      teamConfigs = teamConfigs.slice(0, teamCount);
      renderPage();
    });

    on("#teamPlus", "click", () => {
      if (teamCount >= MAX_TEAMS) return;
      syncNames();
      const slotIndex = teamCount;
      teamCount++;
      teamConfigs.push({
        name: "", 
        colorHex: DEFAULT_SLOT_COLORS[slotIndex % DEFAULT_SLOT_COLORS.length],
        isCustom: false,
        raw: null
      });
      renderPage();
      animateTeamSlot(slotIndex);
    });

    on("#teamNames", "input", e => {
      if (!e.target.classList.contains("team-input")) return;
      const i = +e.target.dataset.idx;
      animatingSlots.delete(i); 
      if (teamConfigs[i]) {
        teamConfigs[i].name = e.target.value;
        teamConfigs[i].isCustom = true; 
      }
    });

    const tsIn = $("#targetScoreInput");
    const rtIn = $("#roundTimeInput");
    if (tsIn) on(tsIn, "input", () => {
      const v = parseInt(tsIn.value, 10);
      if (!Number.isNaN(v)) targetScore = clampTarget(v);
    });
    if (rtIn) on(rtIn, "input", () => {
      const v = parseInt(rtIn.value, 10);
      if (!Number.isNaN(v)) roundTime = clampRound(v);
    });

    on("#openCategoriesBtn", "click", () => {
      isModalOpen            = true;
      tempSelectedCategories = [...selectedCategories];
      renderPage();
    });

    if (isModalOpen) {
      $$(".cat-box").forEach(box => {
        on(box, "click", () => {
          const id = box.dataset.id;
          if (id === "all") {
            tempSelectedCategories = ["all"];
          } else {
            tempSelectedCategories = tempSelectedCategories.filter(c => c !== "all");
            if (tempSelectedCategories.includes(id)) {
              tempSelectedCategories = tempSelectedCategories.filter(c => c !== id);
            } else {
              tempSelectedCategories.push(id);
            }
            if (tempSelectedCategories.length === 0) tempSelectedCategories = ["all"];
          }
          renderPage();
        });
      });

      on("#randomCatBtn", "click", async () => {
        const btn = $("#randomCatBtn");
        if (btn.disabled) return;
        btn.disabled = true;

        const availableCats = [];
        $$(".cat-box").forEach(box => {
          if (box.dataset.id !== "all") availableCats.push(box.dataset.id);
        });

        const iterator    = roundRobinGenerator(availableCats);
        let lastSelectedId = null;

        await consumeIteratorWithTimeout(iterator, 2, (currentId) => {
          $$(".cat-box").forEach(box => box.classList.remove("selected"));
          const currentBox = $(`.cat-box[data-id="${currentId}"]`);
          if (currentBox) currentBox.classList.add("selected");
          lastSelectedId = currentId;
        });

        if (lastSelectedId) tempSelectedCategories = [lastSelectedId];
        btn.disabled = false;
      });

      on("#cancelCatBtn",  "click", () => { isModalOpen = false; renderPage(); });
      on("#confirmCatBtn", "click", () => {
        selectedCategories = [...tempSelectedCategories];
        isModalOpen        = false;
        renderPage();
      });
    }

    const startBtn = $("#beginGameBtn");
    const btnIcon  = startBtn?.querySelector(".btn-icon");
    const btnText  = startBtn?.querySelector(".btn-text");

    if (startBtn && btnIcon && btnText) {
      on(startBtn, "mouseenter", () => {
        const btnW      = startBtn.offsetWidth;
        const iconRect  = btnIcon.getBoundingClientRect();
        const btnLeft   = startBtn.getBoundingClientRect().left;
        const iconShift = Math.round(btnW / 2 - (iconRect.left + iconRect.width / 2 - btnLeft));
        btnIcon.style.transform = `translateX(${iconShift}px)`;
        btnText.style.transform = `translateX(${btnW + 20}px)`;
      });
      on(startBtn, "mouseleave", () => {
        btnIcon.style.transform = "translateX(0)";
        btnText.style.transform = "translateX(0)";
      });
    }

    let validationAbortController = null;

    on("#beginGameBtn", "click", async () => {
      syncNames();

      const startBtn = $("#beginGameBtn");
      if (startBtn.disabled) return;

      startBtn.disabled         = true;
      const originalText        = btnText.textContent;
      btnText.textContent       = t("settingsScreen.loading") || "Перевірка...";
      validationAbortController = new AbortController();

      try {
        const teamNamesList = teamConfigs.map(c => c.name);
        const hasBannedName = await asyncSomePromiseAbortable(
          teamNamesList,
          (name, _i, _arr, signal) => checkTeamNameValid(name, signal),
          validationAbortController.signal,
        );

        if (hasBannedName) {
          alert("Одна з команд має недопустиме ім'я! Будь ласка, змініть назву.");
          startBtn.disabled   = false;
          btnText.textContent = originalText;
          return;
        }

        const tsRaw = parseInt(tsIn?.value ?? String(targetScore), 10);
        const rtRaw = parseInt(rtIn?.value ?? String(roundTime),   10);
        targetScore = clampTarget(Number.isNaN(tsRaw) ? targetScore : tsRaw);
        roundTime   = clampRound (Number.isNaN(rtRaw) ? roundTime   : rtRaw);

        let injectedCustomWords = [];
        selectedCategories.forEach(id => {
          const customCat = customCategories.find(c => c.id === id);
          if (customCat) injectedCustomWords = injectedCustomWords.concat(customCat.words);
        });

        onStart({
          teams: teamConfigs.map((c, i) =>
            c.name.trim() || t("settingsScreen.teamPlaceholder", { number: i + 1 })
          ),
          teamColors:         teamConfigs.map(c => c.colorHex),
          difficulty:         selectedDifficulty,
          category:           selectedCategories[0],
          selectedCategories: selectedCategories.includes("all") ? [] : [...selectedCategories],
          targetScore,
          roundTime,
          customWords:        injectedCustomWords.length > 0 ? injectedCustomWords : null,
          customCategoryName: document.getElementById("categoriesBtnText")?.textContent || null,
        });

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log("Перевірку команд було скасовано гравцем.");
        } else {
          console.error("Помилка валідації:", err);
        }
        startBtn.disabled   = false;
        btnText.textContent = originalText;
      }
    });
  }
}