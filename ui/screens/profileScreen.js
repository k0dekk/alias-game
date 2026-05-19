import { render, $, on, fadeIn } from "../../ui/render.js";
import { t } from "../../utils/i18n.js";
import { applyLayout } from "../../ui/layout.js";
import { logoutUser } from "../../utils/auth.js";
import {
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
  ensureUserProfile,
} from "../../utils/userProfile.js";
import { 
  getCustomCategories, 
  saveCustomCategory, 
  deleteCustomCategory 
} from "../../utils/proxy/customCategoriesApi.js";

import "../../styles/pages/profile-screen.css";

/**
 * @param {import("firebase/auth").User} user
 * @param {() => void} onBack
 */

export async function showProfileScreen(user, onBack) {
  applyLayout("contained");
  if (!user?.uid) {
    onBack();
    return;
  }

  // очищеня екрану 
  render(`
    <section class="profile-screen settings-card">
      <h1 class="profile-screen__title" style="text-align: center; margin-top: 50px;">${t("profile.loading")}</h1>
    </section>
  `);

  // Стан для роботи з кастомними словниками
  let customCats = [];
  let isDictModalOpen = false;
  let newDictName = "";
  let newDictWords = [
    { word: "", difficulty: "easy" },
    { word: "", difficulty: "medium" },
    { word: "", difficulty: "hard" }
  ];

  try {
    // запит до ьд
    let profile = await ensureUserProfile(user);
    if (!profile) profile = await getUserProfile(user.uid);

    // Завантажуємо кастомні категорії користувача з Firestore REST API
    try {
      customCats = await getCustomCategories(user.uid);
    } catch (e) {
      console.error("Помилка завантаження кастомних словників:", e);
    }

    // малювання інтерфейсу
    function paint() {
      const initials = (profile.displayName || "?").slice(0, 2).toUpperCase();

      render(`
        <section class="profile-screen settings-card">
          <header class="profile-screen__head">
            <button type="button" class="profile-screen__back" id="profileBackBtn">
              <span aria-hidden="true">←</span> ${t("profile.back")}
            </button>
            <h1 class="profile-screen__title">${t("profile.title")}</h1>
          </header>

          <div class="profile-screen__email">${user.email || ""}</div>

          <div class="profile-screen__avatar-block">
            <div class="profile-screen__avatar-wrap" id="avatarPreviewWrap">
              ${profile.photoURL
                ? `<img class="profile-screen__avatar-img" id="avatarPreview" src="${profile.photoURL}" alt="" />`
                : `<div class="profile-screen__avatar-fallback" id="avatarPreview" style="background: linear-gradient(135deg, #1a237e, #5c6bc0)">${initials}</div>`}
            </div>
            <label class="profile-upload" style="margin-top: 16px;">
              <input type="file" id="avatarFile" accept="image/*" hidden />
              <span class="profile-upload__btn">${t("profile.uploadPhoto")}</span>
            </label>
          </div>

          <label class="profile-field">
            <span>${t("profile.nickname")}</span>
            <input type="text" id="profileNickname" maxlength="32" value="${escapeAttr(profile.displayName)}" />
          </label>

          <div class="profile-stats">
            <div class="profile-stats__card" style="margin-bottom: 10px;">
              <span class="profile-stats__value" id="gamesPlayedVal">${profile.gamesPlayed ?? 0}</span>
              <span class="profile-stats__label">${t("profile.gamesPlayed")}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div class="profile-stats__card">
                <span class="profile-stats__value" style="color: #2d8a3e;">${profile.wordsGuessed ?? 0}</span>
                <span class="profile-stats__label">${t("profile.wordsGuessed")}</span>
              </div>
              <div class="profile-stats__card">
                <span class="profile-stats__value" style="color: #a82315;">${profile.wordsSkipped ?? 0}</span>
                <span class="profile-stats__label">${t("profile.wordsSkipped")}</span>
              </div>
            </div>
          </div>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid rgba(255,255,255,0.15);" />
          
          <div class="profile-dictionaries" style="margin-bottom: 20px; text-align: left;">
            <h3 style="margin-bottom: 12px; font-size: 18px; color: #fff;">${t("profile.customDictionaries")}</h3>
            <ul style="list-style: none; padding: 0; margin: 0 0 15px 0;">
              ${customCats.map(cat => `
                <li class="profile-dict-item">
                  <span class="profile-dict-name">
                    ${escapeAttr(cat.packName || cat.name || $t("profile.untitledDictionary"))}
                  </span>
                  <span class="profile-dict-count">
                    (${cat.words?.length || 0} слів)
                  </span>
                  <button type="button" class="delete-cat-btn" data-id="${cat.id}">${t("profile.deleteDictionary")}</button>
                </li>
              `).join("")}
              ${customCats.length === 0 ? `<li class="profile-dict-empty">${t("profile.noCustomDictionaries")}</li>` : ""}
            </ul>
            <button type="button" class="profile-save" id="openDictModalBtn" style="background: #2d8a3e; margin: 0; width: 100%;">+ ${t("profile.createDictionary")}</button>
          </div>

          <p class="profile-error" id="profileError" hidden></p>

          <button type="button" class="profile-save" id="profileSaveBtn">${t("profile.save")}</button>

          <button type="button" class="profile-logout" id="profileLogoutBtn">${t("profile.logout")}</button>
        </section>

        ${isDictModalOpen ? `
        <div class="modal-overlay" id="dictModalOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px;">
          <div class="modal-content settings-modal-content" style="background: #2b1d1d; border: 2px solid #5c3d3d; border-radius: 16px; padding: 24px; width: 100%; max-width: 500px; max-height: 85vh; overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.5); text-align: left;">
            <h2 style="margin-top: 0; margin-bottom: 20px; text-align: center; color: #fff;">${t("profile.newDictionary")}</h2>
            
            <label class="profile-field" style="margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px;">
              <span style="font-weight: 600; font-size: 14px; color: #fff;">${t("profile.dictionaryName")}</span>
              <input type="text" id="newDictNameInput" value="${escapeAttr(newDictName)}" placeholder="${t("profile.dictionaryExample")}" style="padding: 10px; border-radius: 8px; border: 1px solid #443333; background: #1a1010; color: #fff;" />
            </label>

            <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #fff;">${t("profile.wordsAndDifficulty")}</div>
            <div id="wordsListContainer" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
              ${newDictWords.map((item, idx) => `
                <div class="word-row" style="display: flex; gap: 8px; align-items: center;">
                  <input type="text" class="word-input" value="${escapeAttr(item.word)}" placeholder="${t("profile.wordPlaceholder")}" style="flex: 1; padding: 8px; border-radius: 6px; border: 1px solid #443333; background: #1a1010; color: #fff;" />
                  <select class="diff-select" style="padding: 8px; border-radius: 6px; border: 1px solid #443333; background: #1a1010; color: #fff; cursor: pointer;">
                    <option value="easy" ${item.difficulty === 'easy' ? 'selected' : ''}>${t("profile.easy")}</option>
                    <option value="medium" ${item.difficulty === 'medium' ? 'selected' : ''}>${t("profile.medium")}</option>
                    <option value="hard" ${item.difficulty === 'hard' ? 'selected' : ''}>${t("profile.hard")}</option>
                  </select>
                  <button type="button" class="remove-word-btn" data-idx="${idx}" style="background: none; border: none; color: #a82315; cursor: pointer; font-size: 20px; padding: 0 4px; line-height: 1;">✖</button>
                </div>
              `).join("")}
            </div>
            
            <button type="button" id="addWordRowBtn" style="background: transparent; color: #7ecf7a; border: 1px solid #2d8a3e; padding: 8px 12px; border-radius: 8px; margin-bottom: 24px; cursor: pointer; width: 100%; font-weight: 600; transition: background 0.2s;">+ ${t("profile.addWord")}</button>

            <div class="modal-actions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <button id="cancelDictBtn" type="button" style="padding: 12px; border-radius: 8px; border: 1px solid #555; background: #332222; color: #fff; cursor: pointer; font-weight: bold;">${t("profile.cancel")}</button>
              <button id="saveNewDictBtn" type="button" style="padding: 12px; border-radius: 8px; border: none; background: #2d8a3e; color: #fff; cursor: pointer; font-weight: bold;">${t("profile.save")}</button>
            </div>
          </div>
        </div>
        ` : ""}
      `);

      fadeIn();

      on("#profileBackBtn", "click", onBack);

      on("#avatarFile", "change", async (e) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        const errEl = $("#profileError");
        errEl.hidden = true;
        try {
          const url = await uploadUserAvatar(user.uid, file);
          profile.photoURL = url;
          await updateUserProfile(user.uid, { photoURL: url });
          paint();
        } catch (err) {
          console.error("Помилка завантаження аватара:", err);
          errEl.textContent = t("profile.errorUpload");
          errEl.hidden = false;
        }
        e.target.value = "";
      });

      on("#profileSaveBtn", "click", async () => {
        const errEl = $("#profileError");
        errEl.hidden = true;
        const name = ($("#profileNickname")?.value || "").trim() || defaultName(user);
        try {
          const patch = { displayName: name };
          if (!profile.photoURL) {
            patch.photoURL = "";
          }
          await updateUserProfile(user.uid, patch);
          profile.displayName = name;
          errEl.textContent = t("profile.saved");
          errEl.hidden = false;
          errEl.classList.add("is-ok");
          setTimeout(() => { errEl.hidden = true; errEl.classList.remove("is-ok"); }, 2000);
        } catch {
          errEl.textContent = t("profile.errorSave");
          errEl.hidden = false;
        }
      });

      on("#profileLogoutBtn", "click", async () => {
        await logoutUser();
        onBack();
      });

      // Хендлер видалення кастомного словника
      document.querySelectorAll(".delete-cat-btn").forEach(btn => {
        on(btn, "click", async () => {
          if (!confirm("Дійсно видалити цей словник?")) return;
          const catId = btn.dataset.id;
          try {
            await deleteCustomCategory(user.uid, catId);
            customCats = customCats.filter(c => c.id !== catId);
            paint();
          } catch (e) {
            console.error(e);
            alert("Помилка при видаленні словника.");
          }
        });
      });

      // Логіка роботи з модальним вікном створення словника
      if (!isDictModalOpen) {
        on("#openDictModalBtn", "click", () => {
          isDictModalOpen = true;
          newDictName = "";
          newDictWords = [
            { word: "", difficulty: "easy" },
            { word: "", difficulty: "medium" },
            { word: "", difficulty: "hard" }
          ];
          paint();
        });
      } else {
        function syncModalState() {
          newDictName = ($("#newDictNameInput")?.value || "").trim();
          const rows = document.querySelectorAll("#wordsListContainer .word-row");
          newDictWords = [];
          rows.forEach(row => {
            const word = (row.querySelector(".word-input")?.value || "").trim();
            const difficulty = row.querySelector(".diff-select")?.value || "easy";
            newDictWords.push({ word, difficulty });
          });
        }

        on("#addWordRowBtn", "click", () => {
          syncModalState();
          newDictWords.push({ word: "", difficulty: "easy" });
          paint();
        });

        document.querySelectorAll(".remove-word-btn").forEach(btn => {
          on(btn, "click", () => {
            syncModalState();
            const idx = Number(btn.dataset.idx);
            newDictWords.splice(idx, 1);
            paint();
          });
        });

        on("#cancelDictBtn", "click", () => {
          isDictModalOpen = false;
          paint();
        });

        on("#saveNewDictBtn", "click", async () => {
          syncModalState();
          const name = newDictName.trim();
          const validWords = newDictWords.filter(w => w.word.trim().length > 0);

          if (!name) {
            alert("Будь ласка, введіть назву словника!");
            return;
          }
          if (validWords.length === 0) {
            alert("Додайте хоча б одне заповнене слово!");
            return;
          }

          try {
            const categoryId = "custom_" + Date.now();
            await saveCustomCategory(user.uid, categoryId, name, validWords);
            
            customCats = await getCustomCategories(user.uid);
            isDictModalOpen = false;
            paint();
          } catch (e) {
            console.error(e);
            alert("Не вдалося зберегти словник у базі даних.");
          }
        });
      }
    }

    paint();

  } catch (error) {
    console.error("Помилка завантаження профілю з Firestore:", error);

    render(`
      <section class="profile-screen settings-card" style="text-align: center; padding: 40px;">
        <h1 class="profile-screen__title" style="color: #d32f2f;">Помилка бази даних</h1>
        <p style="margin-top: 10px; color: #5a3a28; font-size: 14px;">
          Не вдалося завантажити профіль з хмари. Перевір, чи створена база даних <b>Firestore Database</b> у Firebase Console (обов'язково в тестовому режимі).
        </p>
        <button type="button" class="profile-logout" id="errorBackBtn" style="margin-top: 24px;">На головну</button>
      </section>
    `);

    on("#errorBackBtn", "click", onBack);
  }

  function defaultName(u) {
    const e = u.email || "";
    return e.split("@")[0] || "Player";
  }
}

function escapeAttr(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}