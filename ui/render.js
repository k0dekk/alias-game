const app = document.getElementById("app");

export function render(html) {
  app.innerHTML = html;
}

export function $(sel)  { return document.querySelector(sel); }
export function $$(sel) { return document.querySelectorAll(sel); }

export function on(sel, event, cb) {
  const el = typeof sel === "string" ? $(sel) : sel;
  if (el) el.addEventListener(event, cb);
}

export function fadeIn() {}
