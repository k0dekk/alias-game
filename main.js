import "./styles/layout/main.css";
import { showStartScreen } from "./ui/screens/startScreen.js";
import { showSettingsScreen } from "./ui/screens/settingsScreen.js";
import { showGameScreen, stopTimer } from "./ui/screens/gameScreen.js";
import { showGameOverScreen } from "./ui/screens/resultScreen.js";
import { showAuthScreen } from "./ui/screens/authScreen.js";
import { showProfileScreen } from "./ui/screens/profileScreen.js";
import { createGame } from "./game/gameState.js";
import { setLanguage, t, onLanguageChange, getLanguage } from "./utils/i18n.js";
import { subscribeAuth } from "./utils/auth.js";
import { ensureUserProfile, getUserProfile } from "./utils/userProfile.js";

let state = null;
let currentScreen = "start";

let firebaseUser = null;
let userProfile = null;

function syncLangChrome() {
  document.title = t("app.title");
}

function onGameUpdate(meta) {
  if (meta?.goFinal) {
    currentScreen = "gameOver";
  }
  renderCurrentScreen();
}

function renderCurrentScreen() {
  syncLangChrome();

  if (currentScreen === "settings") {
    return showSettingsScreen(startGame, goToStart);
  }

  if (currentScreen === "auth") {
    return showAuthScreen(goToStart);
  }

  if (currentScreen === "profile" && firebaseUser) {
    return showProfileScreen(firebaseUser, goToStart);
  }

  if (currentScreen === "gameOver" && state) {
    return showGameOverScreen(state, restart);
  }

  if (currentScreen === "game" && state) {
    return showGameScreen(state, onGameUpdate);
  }

  showStartScreen(goToSettings, openAuth, openProfile, firebaseUser, userProfile);
}

function goToSettings() {
  currentScreen = "settings";
  renderCurrentScreen();
}

function goToStart() {
  currentScreen = "start";
  renderCurrentScreen();
}

function openAuth() {
  currentScreen = "auth";
  renderCurrentScreen();
}

function openProfile() {
  if (!firebaseUser) {
    openAuth();
    return;
  }
  currentScreen = "profile";
  renderCurrentScreen();
}

function startGame(opts) {
  state = createGame(opts);
  stopTimer();
  currentScreen = "game";
  renderCurrentScreen();
}

function restart() {
  state = null;
  currentScreen = "start";
  renderCurrentScreen();
  void (async () => {
    if (firebaseUser?.uid) {
      try {
        const p = await getUserProfile(firebaseUser.uid);
        if (p) userProfile = p;
      } catch {
        /* ignore */
      }
    }
    renderCurrentScreen();
  })();
}

function init() {
  subscribeAuth(async (user) => {
    firebaseUser = user;
    if (!user && currentScreen === "profile") {
      currentScreen = "start";
    }
    if (user) {
      try {
        userProfile = await ensureUserProfile(user);
      } catch {
        userProfile = null;
      }
    } else {
      userProfile = null;
    }
    if (currentScreen === "start" || currentScreen === "profile") {
      renderCurrentScreen();
    }
  });

  document.documentElement.lang = getLanguage();

  document.body.addEventListener("click", (e) => {
    if (!e.target.closest("#btn-lang")) return;
    setLanguage(getLanguage() === "uk" ? "en" : "uk");
  });

  onLanguageChange((lang) => {
    document.documentElement.lang = lang;
    renderCurrentScreen();
  });

  renderCurrentScreen();
}

init();
