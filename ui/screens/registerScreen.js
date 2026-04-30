import { render, on, fadeIn } from "../render.js";

export function showRegisterScreen(onRegisterSuccess, onGoToLogin, onBack) {
  render(`
    <div class="auth-container">
      <h2>Реєстрація</h2>
      <form id="registerForm" style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 0 auto;">
        <input type="text" id="username" placeholder="Ім'я користувача" required />
        <input type="text" id="email" placeholder="Email" required />
        <input type="text" id="password" placeholder="Пароль" required />
        <button type="submit" id="registerBtn">Зареєструватись</button>
      </form>
      
      <div style="margin-top: 15px;">
        <span style="font-size: 14px;">Вже є акаунт? </span>
        <a href="#" id="toLoginBtn" style="font-size: 14px; color: blue; text-decoration: underline;">Увійти</a>
      </div>
      
      <button id="backBtn" style="margin-top: 20px;">Назад</button>
    </div>
  `);

  fadeIn();

  on("#registerForm", "submit", (e) => {
    e.preventDefault();

    onRegisterSuccess();
  });

  on("#toLoginBtn", "click", (e) => {
    e.preventDefault();
    onGoToLogin();
  });

  on("#backBtn", "click", onBack);
}