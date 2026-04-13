import { render, on, fadeIn } from "../render.js";

export function showStartScreen(onContinue) {
  render(`
    <div>
      <h1>ALIAS</h1>
      <hr>
      <button id="startBtn">Почати гру</button>
    </div>
  `);

  fadeIn();
  on("#startBtn", "click", onContinue);
}
