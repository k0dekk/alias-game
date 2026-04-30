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

function showHeaderControls() {
  const langSel = document.getElementById("languageSelect");
  const accBtn = document.getElementById("headerAccountBtn");
  
  if (langSel) langSel.style.display = "inline-block";
  if (accBtn) accBtn.style.display = "inline-block";
}

function hideHeaderControls() {
  const langSel = document.getElementById("languageSelect");
  const accBtn = document.getElementById("headerAccountBtn");
  
  if (langSel) langSel.style.display = "none";
  if (accBtn) accBtn.style.display = "none";
}

function syncUI() {
  document.title = t("app.title");
  const sel = document.getElementById("languageSelect");
  if (sel) sel.value = getLanguage();
}

function renderCurrentScreen() {
  syncUI();

  if (currentScreen === "start") {
    showHeaderControls();
  } else {
    hideHeaderControls();
  }

  if (currentScreen === "settings")          return showSettingsScreen(startGame);
  if (currentScreen === "game" && state)     return showGameScreen(state, onRoundEnd);
  if (currentScreen === "gameOver" && state) return showGameOverScreen(state, restart);
  
  if (currentScreen === "login") {
    return showLoginScreen(
      () => { isLoggedIn = true; currentScreen = "profile"; renderCurrentScreen(); }, 
      () => { currentScreen = "register"; renderCurrentScreen(); },                  
      () => { currentScreen = "start"; renderCurrentScreen(); }                      
    );
  }
  
  if (currentScreen === "register") {
    return showRegisterScreen(
      () => { isLoggedIn = true; currentScreen = "profile"; renderCurrentScreen(); }, 
      () => { currentScreen = "login"; renderCurrentScreen(); },                     
      () => { currentScreen = "start"; renderCurrentScreen(); }                      
    );
  }

  if (currentScreen === "profile") {
    return showProfileScreen(
      () => { currentScreen = "start"; renderCurrentScreen(); }, 
      () => { isLoggedIn = false; currentScreen = "start"; renderCurrentScreen(); } 
    );
  }
  showStartScreen(goToSettings);
}

function handleAccountClick() {
  if (isLoggedIn) {
    currentScreen = "profile";
  } else {
    currentScreen = "login";
  }
  renderCurrentScreen();
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