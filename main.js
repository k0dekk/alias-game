import "./styles/main.css";
import { showStartScreen }           from "./ui/screens/startScreen.js";
import { showSettingsScreen }        from "./ui/screens/settingsScreen.js";
import { showGameScreen, stopTimer } from "./ui/screens/gameScreen.js";
import { showGameOverScreen }        from "./ui/screens/resultScreen.js";
import { createGame }                from "./game/gameState.js";
import { getLanguage, setLanguage, t, onLanguageChange } from "./utils/i18n.js";
import { showLoginScreen }           from "./ui/screens/loginScreen.js";
import { showRegisterScreen }        from "./ui/screens/registerScreen.js";
import { showProfileScreen }         from "./ui/screens/profileScreen.js";

let state = null;
let currentScreen = "start";
let isLoggedIn = false;

function syncUI() {
  document.title = t("app.title");
  
  const sel = document.getElementById("languageSelect");
  const accBtn = document.getElementById("headerAccountBtn");
  
  if (sel) {
    sel.value = getLanguage();
    sel.style.display = currentScreen === "start" ? "inline-block" : "none";
  }

  if (accBtn) {
    accBtn.style.display = currentScreen === "start" ? "inline-block" : "none";
  }
}

function renderCurrentScreen() {
  syncUI();
  if (currentScreen === "settings")              return showSettingsScreen(startGame);
  if (currentScreen === "game" && state)         return showGameScreen(state, onRoundEnd);
  if (currentScreen === "gameOver" && state)     return showGameOverScreen(state, restart);
  showStartScreen(goToSettings);
}

function goToSettings() {
  currentScreen = "settings";
  renderCurrentScreen();
}

function startGame({ teams, difficulty }) {
  state = createGame({ teams, difficulty });
  stopTimer();
  currentScreen = "game";
  renderCurrentScreen();
}

function onRoundEnd() {
  currentScreen = state.phase === "gameOver" ? "gameOver" : "game";
  renderCurrentScreen();
}

function restart() {
  state = null;
  currentScreen = "start";
  renderCurrentScreen();
}

function init() {
  document.getElementById("languageSelect")
    ?.addEventListener("change", (e) => setLanguage(e.target.value));

  document.getElementById("headerAccountBtn")
    ?.addEventListener("click", handleAccountClick);

  onLanguageChange(() => renderCurrentScreen());

  renderCurrentScreen();
}

init();