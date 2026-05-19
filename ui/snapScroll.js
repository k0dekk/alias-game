export function initSnapScroll() {
  let snapLocked = false;

  function getHeroBottom() {
    const hero = document.getElementById("hero");
    return hero ? hero.offsetTop + hero.offsetHeight : 0;
  }

  function customSmoothScrollTo(targetPosition, duration) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
  }

  const SCROLL_DURATION = 1000;
  window.addEventListener("wheel", (e) => {
    if (snapLocked) {
      e.preventDefault();
      return;
    }
    const sy = window.scrollY;
    const heroBottom = getHeroBottom();
    if (e.deltaY > 0 && sy < heroBottom - 5) {
      e.preventDefault();
      snapLocked = true;
      customSmoothScrollTo(heroBottom, SCROLL_DURATION);
      setTimeout(() => { snapLocked = false; }, SCROLL_DURATION + 100);
    } else if (e.deltaY < 0 && sy > 0 && sy <= heroBottom + 5) {
      e.preventDefault();
      snapLocked = true;
      customSmoothScrollTo(0, SCROLL_DURATION);
      setTimeout(() => { snapLocked = false; }, SCROLL_DURATION + 100);
    }
  }, { passive: false });
}
