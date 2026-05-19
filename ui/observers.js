class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    return () => {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    };
  }

  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }
}

export function initObservers() {
  const heroTitle = document.getElementById("hero-title");
  if (heroTitle) {
    new IntersectionObserver(([e]) => {
      uiEventBus.emit("heroScrolled", { isHidden: !e.isIntersecting });
    }, { rootMargin: "-56px 0px 0px 0px", threshold: 0 }).observe(heroTitle);
  }

  const headerLogo = document.getElementById("header-logo");
  let unsubscribeHeader = null;
  if (headerLogo) {
    unsubscribeHeader = uiEventBus.subscribe("heroScrolled", (data) => {
      headerLogo.classList.toggle("visible", data.isHidden);
    });
  }

  const scrollButton = document.querySelector(".button-with-icon"); // Тимчасова заглушка в HTML
  let unsubscribeButton = null;

    if (scrollButton) {
        unsubscribeButton = uiEventBus.subscribe("heroScrolled", (data) => {
        if (data.isHidden) {
        scrollButton.classList.add("scrolled-state");
    } else {
      scrollButton.classList.remove("scrolled-state");
    }
  });
    }

  return function destroyObservers() {
    if (unsubscribeHeader) unsubscribeHeader();
    if (unsubscribeButton) unsubscribeButton();
  };
}

export const uiEventBus = new EventEmitter();