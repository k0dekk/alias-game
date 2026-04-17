import "./styles/main.css";
import { showStartScreen }         from "./ui/screens/startScreen.js";
import { showSettingsScreen }      from "./ui/screens/settingsScreen.js";
import { showGameScreen, stopTimer } from "./ui/screens/gameScreen.js";
import { showGameOverScreen }      from "./ui/screens/resultScreen.js";
import { createGame }              from "./game/gameState.js";

let state = null;
let currentScreen = "start";

function renderCurrentScreen() {
  if (currentScreen === "settings")              return showSettingsScreen(startGame);
  if (currentScreen === "game" && state)         return showGameScreen(state, onRoundEnd);
  if (currentScreen === "gameOver" && state)     return showGameOverScreen(state, restart);
  showStartScreen(goToSettings);
}

function goToSettings() {
  currentScreen = "settings";
  renderCurrentScreen();
}

function startGame({ teams, difficulty, selectedCategories }) {
  state = createGame({ teams, difficulty, selectedCategories });
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

renderCurrentScreen();