import { render, on, fadeIn } from "../render.js";

export function showLoginScreen(onLoginSuccess, onGoToRegister, onBack) {
  render(`
    <div class="auth-container">
      <h2>Вхід</h2>
      <form id="loginForm" style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 0 auto;">
        <input type="text" id="email" placeholder="Email" required />
        <input type="text" id="password" placeholder="Пароль" required />
        <button type="submit" id="loginBtn">Увійти</button>
      </form>
      
      <div style="margin-top: 15px;">
        <span style="font-size: 14px;">Ще немає акаунта? </span>
        <a href="#" id="toRegisterBtn" style="font-size: 14px; color: blue; text-decoration: underline;">Зареєструватись</a>
      </div>
      
      <button id="backBtn" style="margin-top: 20px;">Назад</button>
    </div>
  `);

  fadeIn();

  on("#loginForm", "submit", (e) => {
    e.preventDefault();

    onLoginSuccess();
  });

  on("#toRegisterBtn", "click", (e) => {
    e.preventDefault();
    onGoToRegister();
  });

  on("#backBtn", "click", onBack);
}