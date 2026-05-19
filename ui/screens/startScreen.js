import { render, on, fadeIn } from "../../ui/render.js";
import { getStartScreenMarkup } from "./startScreenMarkup.js";
import { startTyping } from "../../ui/typing.js";
import { initSnapScroll } from "../../ui/snapscroll.js";
import { initCardRotator } from "../../ui/cardRotator.js";
import { initObservers } from "../../ui/observers.js";
import { applyLayout } from "../../ui/layout.js";
import { t } from "../../utils/i18n.js";

import "../../styles/base/base.css";
import "../../styles/components/header.css";
import "../../styles/base/hero.css";
import "../../styles/base/animations.css";
import "../../styles/base/content.css";
import "../../styles/components/buttons.css";
import "../../styles/components/footer.css";

/**
 * @param {() => void} onContinue
 * @param {() => void} onOpenAuth
 * @param {() => void} onOpenProfile
 * @param {import("firebase/auth").User | null} firebaseUser
 * @param {{ displayName?: string } | null} userProfile
 */

export function showStartScreen(onContinue, onOpenAuth, onOpenProfile, firebaseUser, userProfile) {
  applyLayout("full", false);

  render(getStartScreenMarkup());

  const accountBtn = document.getElementById("btn-account");
  const accountLabel = document.getElementById("account-label");
  if (accountBtn && accountLabel) {
    if (firebaseUser?.email) {
      const nick = userProfile?.displayName?.trim();
      accountLabel.textContent = nick || firebaseUser.email;
      accountBtn.title = t("startScreen.openProfileHint");
    } else {
      accountLabel.textContent = t("startScreen.account");
      accountBtn.title = "";
    }
  }

  fadeIn();
  initSnapScroll();
  initCardRotator();
  initObservers();

  startTyping(document.getElementById("hero-typed"), "ALIAS", 130);

  on(".button-with-icon", "click", onContinue);

  if (accountBtn) {
    on(accountBtn, "click", () => {
      if (firebaseUser?.uid && typeof onOpenProfile === "function") {
        onOpenProfile();
      } else if (typeof onOpenAuth === "function") {
        onOpenAuth();
      }
    });
  }
}
