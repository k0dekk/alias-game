import { showStartScreen }                          from "./ui/screens/startScreen.js";
import { showReadyScreen, showGameScreen, stopTimer } from "./ui/screens/gameScreen.js";
import { showRoundEndScreen, showGameOverScreen }    from "./ui/screens/resultScreen.js";
import { createGame }                                from "./game/gameState.js";

let state = null;

function startGame({ teams, difficulty }) {
  state = createGame({ teams, difficulty });
  goToReady();
}

function goToReady() {
  stopTimer();
  showReadyScreen(state, () => {
    showGameScreen(state, onRoundEnd);
  });
}

function onRoundEnd(result) {
  if (state.phase === "gameOver") {
    showRoundEndScreen(state, result, () => showGameOverScreen(state, restart));
  } else {
    showRoundEndScreen(state, result, goToReady);
  }
}

function restart() {
  showStartScreen(startGame);
}

showStartScreen(startGame);
