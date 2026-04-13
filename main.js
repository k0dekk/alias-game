import "./main.css";
import { showStartScreen }                          from "./ui/screens/startScreen.js";
import { showSettingsScreen }                       from "./ui/screens/settingsScreen.js";
import { showGameScreen, stopTimer }                from "./ui/screens/gameScreen.js";
import { showGameOverScreen }                       from "./ui/screens/resultScreen.js";
import { createGame }                               from "./game/gameState.js";

let state = null;

function startGame({ teams, difficulty }) {
  state = createGame({ teams, difficulty });
  stopTimer();
  showGameScreen(state, onRoundEnd);
}

function onRoundEnd(result) {
  if (state.phase === "gameOver") {
    showGameOverScreen(state, restart);
  } else {
    showGameScreen(state, onRoundEnd);
  }
}

function restart() {
  showStartScreen(() => showSettingsScreen(startGame));
}

showStartScreen(() => showSettingsScreen(startGame));
