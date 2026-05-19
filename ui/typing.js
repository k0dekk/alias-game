export function startTyping(el, text, delay) {
  if (!el) return;
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(timer);
  }, delay);
}
