
export function applyLayout(mode, showGlobalFooter = false) {
  const footer = document.querySelector('.app-footer');

  if (mode === 'full') {
    document.body.className = 'layout-full';
  } else if (mode === 'contained') {
    document.body.className = 'layout-contained';
  }

  if (footer) {
    footer.style.display = showGlobalFooter ? 'block' : 'none';
  }
}