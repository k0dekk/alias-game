import { render, on, fadeIn } from "../render.js";
import { t } from "../../utils/i18n.js";

export function showRegisterScreen(onRegisterSuccess, onGoToLogin, onBack) {
  render(`
    <div class="auth-container">
      <h2>${t("auth.registerTitle")}</h2>
      <form id="registerForm" style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 0 auto;">
        <input type="text" id="username" placeholder="${t("auth.usernamePlaceholder")}" required />
        <input type="email" id="email" placeholder="${t("auth.emailPlaceholder")}" required />
        <input type="password" id="password" placeholder="${t("auth.passwordPlaceholder")}" required />
        <button type="submit" id="registerBtn">${t("auth.registerButton")}</button>
      </form>
      
      <div style="margin-top: 15px;">
        <span style="font-size: 14px;">${t("auth.hasAccountText")}</span>
        <a href="#" id="toLoginBtn" style="font-size: 14px; color: blue; text-decoration: underline;">${t("auth.loginLink")}</a>
      </div>
      
      <button id="backBtn" style="margin-top: 20px;">${t("auth.backButton")}</button>
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