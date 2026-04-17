import { render, on, fadeIn } from "../render.js";
import { t } from "../../utils/i18n.js";

export function showStartScreen(onContinue) {
  render(`
    <div>
      <h1>ALIAS</h1>
      <hr>
      <button id="startBtn">${t("startScreen.startButton")}</button>
    </div>
  `);

  fadeIn();
  on("#startBtn", "click", onContinue);
}
