import { render, on, fadeIn } from "../render.js";

export function showProfileScreen(onBack, onLogout, userData = null) {
  const user = userData || {
    username: "user 1231",
    registeredSince: "12.04.2026",
    guessedWords: 142,
    skippedWords: 34
  };

  render(`
    <div class="profile-container" style="max-width: 400px; margin: 0 auto; text-align: left; padding: 20px;">
      
      <div class="profile-header" style="display: flex; align-items: center; gap: 20px; margin-bottom: 40px;">
        <div class="avatar" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #000; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <!-- Проста SVG іконка користувача (як на малюнку) -->
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div style="font-size: 1.2rem; font-weight: 500;">
          ${user.username}
        </div>
      </div>
      
      <div class="profile-stats" style="display: flex; flex-direction: column; gap: 15px; font-size: 1.1rem;">
        <div>Акаунт зареєстрований з: <strong>${user.registeredSince}</strong></div>
        <div>Вгаданих слів: <strong>${user.guessedWords}</strong></div>
        <div>Пропущених слів: <strong>${user.skippedWords}</strong></div>
      </div>

      <div class="profile-actions" style="margin-top: 40px; display: flex; gap: 10px;">
        <button id="backBtn">Назад в меню</button>
        <button id="logoutBtn" style="background-color: #ff4d4d; color: white;">Вийти</button>
      </div>
    </div>
  `);

  fadeIn();

  on("#backBtn", "click", onBack);
  on("#logoutBtn", "click", onLogout);
}