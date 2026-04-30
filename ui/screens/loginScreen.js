import { render, on, fadeIn } from "../render.js";
import { t } from "../../utils/i18n.js";

export function showLoginScreen(onLoginSuccess, onGoToRegister, onBack) {
  render(`
    <div class="auth-container">
      <h2>${t("auth.loginTitle")}</h2>
      <form id="loginForm" style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 0 auto;">
        <input type="email" id="email" placeholder="${t("auth.emailPlaceholder")}" required />
        <input type="password" id="password" placeholder="${t("auth.passwordPlaceholder")}" required />
        <button type="submit" id="loginBtn">${t("auth.loginButton")}</button>
      </form>
      
      <div style="margin-top: 15px;">
        <span style="font-size: 14px;">${t("auth.noAccountText")}</span>
        <a href="#" id="toRegisterBtn" style="font-size: 14px; color: blue; text-decoration: underline;">${t("auth.registerLink")}</a>
      </div>
      
      <button id="backBtn" style="margin-top: 20px;">${t("auth.backButton")}</button>
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