import { t, getLanguage } from "../../utils/i18n.js";

export function getStartScreenMarkup() {
  const langCode = getLanguage() === "uk" ? "UA" : "EN";

  return `
  <header class="header">
    <div class="header__left">
      <span class="header__logo" id="header-logo">ALIAS</span>
    </div>
    <div class="header__right">
      <a href="https://github.com/k0dekk/alias-game/blob/main/README.md" class="nav-item" target="_blank" rel="noreferrer">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        ${t("startScreen.rules")}
      </a>
      <div class="nav-divider"></div>
      <button class="nav-item" type="button" id="btn-account">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span id="account-label">${t("startScreen.account")}</span>
      </button>
      <div class="nav-divider"></div>
      <button class="nav-item" id="btn-lang" type="button">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span id="lang-code">${langCode}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
    </div>
  </header>

  <section class="hero" id="hero">
    <div class="hero__left">
      <h1 class="hero__title" id="hero-title">
        <span id="hero-typed"></span><span class="hero__cursor"></span>
      </h1>
    </div>
    <div class="hero__right">
      <div class="card-container">
        <div class="animated-card card--animals fall-from-top" id="dynamic-card">
          <div class="card__body">
            <span class="card__label" id="card-label">${t("startScreen.categoryLabel")}</span>
            <span class="card__name" id="card-text"></span>
          </div>
          <div class="card__image-wrap">
            <img class="card__gif" id="card-gif" alt="" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="content" id="content">
    <div class="content__inner" id="content-inner">
      <button class="button-with-icon" type="button">
        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z" fill="#ffffff"/>
        </svg>
        <span class="btn-text">${t("startScreen.startButton")}</span>
      </button>
    </div>
  </section>

  <footer class="footer">
    <div class="footer__top">
      <div class="footer__brand">
        <span class="footer__logo">ALIAS</span>
        <span class="footer__tagline">${t("startScreen.tagline")}</span>
      </div>
      <nav class="footer__socials">
        <a href="https://t.me/k0dek" target="_blank" rel="noopener noreferrer" class="footer__social" aria-label="Telegram">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </a>
        <a href="https://www.instagram.com/k0d9k/" target="_blank" rel="noopener noreferrer" class="footer__social" aria-label="Instagram">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <a href="https://github.com/k0dekk" target="_blank" rel="noopener noreferrer" class="footer__social" aria-label="GitHub">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </nav>
    </div>
    <div class="footer__bottom">
      <span class="footer__copy">${t("startScreen.footerCopy")}</span>
    </div>
  </footer>
`;
}