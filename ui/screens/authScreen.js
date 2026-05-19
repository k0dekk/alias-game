import { render, $, on, fadeIn } from "../../ui/render.js";
import { t } from "../../utils/i18n.js";
import { applyLayout } from "../../ui/layout.js";
import { loginWithEmail, registerWithEmail } from "../../utils/auth.js";

import "../../styles/pages/auth-screen.css";

const ARROW_LEFT = `<svg class="auth-switch__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ARROW_RIGHT = `<svg class="auth-switch__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

export function showAuthScreen(onBack) {
  applyLayout("contained");
  let mode = "login";

  function paint() {
    const switchHtml = mode === "register"
      ? `<button type="button" class="auth-switch" id="authSwitchMode">${ARROW_LEFT}<span>${t("auth.switchToLogin")}</span></button>`
      : `<button type="button" class="auth-switch" id="authSwitchMode"><span>${t("auth.switchToRegister")}</span>${ARROW_RIGHT}</button>`;

    render(`
      <section class="auth-screen settings-card">
        <header class="auth-screen__head">
          <button type="button" class="auth-screen__back" id="authBackBtn" aria-label="${t("auth.back")}">
            <span aria-hidden="true">←</span> ${t("auth.back")}
          </button>
          <h1 class="auth-screen__title">${t("auth.title")}</h1>
        </header>

        <div class="auth-screen__tabs" role="tablist">
          <button type="button" class="auth-tab ${mode === "login" ? "is-active" : ""}" id="tabLogin" role="tab">${t("auth.loginTab")}</button>
          <button type="button" class="auth-tab ${mode === "register" ? "is-active" : ""}" id="tabRegister" role="tab">${t("auth.registerTab")}</button>
        </div>

        <form class="auth-form" id="authForm" novalidate>
          <label class="auth-field">
            <span>${t("auth.email")}</span>
            <input type="email" id="authEmail" autocomplete="email" required placeholder="${t("auth.emailPlaceholder")}" />
          </label>
          <label class="auth-field">
            <span>${t("auth.password")}</span>
            <input type="password" id="authPassword" autocomplete="${mode === "login" ? "current-password" : "new-password"}" required minlength="6" placeholder="${t("auth.passwordPlaceholder")}" />
          </label>
          <p class="auth-error" id="authError" hidden></p>
          <button type="submit" class="auth-submit" id="authSubmit">${mode === "login" ? t("auth.loginSubmit") : t("auth.registerSubmit")}</button>
        </form>

        <div class="auth-switch-wrap">${switchHtml}</div>
      </section>
    `);

    fadeIn();

    on("#authBackBtn", "click", onBack);

    on("#tabLogin", "click", () => {
      mode = "login";
      paint();
    });

    on("#tabRegister", "click", () => {
      mode = "register";
      paint();
    });

    on("#authSwitchMode", "click", () => {
      mode = mode === "login" ? "register" : "login";
      paint();
    });

    on("#authForm", "submit", async (e) => {
      e.preventDefault();
      const errEl = $("#authError");
      const email = $("#authEmail")?.value?.trim() || "";
      const password = $("#authPassword")?.value || "";
      errEl.hidden = true;
      errEl.textContent = "";

      try {
        if (mode === "login") {
          await loginWithEmail(email, password);
        } else {
          await registerWithEmail(email, password);
        }
        onBack();
      } catch (err) {
        errEl.textContent = mapAuthError(err?.code);
        errEl.hidden = false;
      }
    });
  }

  paint();
}

function mapAuthError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return t("auth.error.emailInUse");
    case "auth/invalid-email":
      return t("auth.error.invalidEmail");
    case "auth/weak-password":
      return t("auth.error.weakPassword");
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return t("auth.error.invalidCredentials");
    default:
      return t("auth.error.generic");
  }
}
