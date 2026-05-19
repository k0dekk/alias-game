import { t } from "../utils/i18n.js";

const CARD_KEYS = [
  { categoryKey: "animals", cls: "card--animals", gif: `${import.meta.env.BASE_URL}assets/animals.gif` },
  { categoryKey: "food", cls: "card--food", gif: `${import.meta.env.BASE_URL}assets/food.gif` },
  { categoryKey: "nature", cls: "card--nature", gif: `${import.meta.env.BASE_URL}assets/nature.gif` },
];

export function initCardRotator() {
  const card = document.getElementById("dynamic-card");
  const cardText = document.getElementById("card-text");
  const cardLabel = document.getElementById("card-label");
  const cardGif = document.getElementById("card-gif");

  if (!card || !cardText || !cardLabel || !cardGif) return;

  let currentIndex = 0;

  function applyCard(data) {
    card.className = `animated-card ${data.cls}`;
    cardText.textContent = t(`categories.${data.categoryKey}`);
    cardLabel.textContent = t("startScreen.categoryLabel");

    cardGif.src = data.gif;
    cardGif.alt = t(`categories.${data.categoryKey}`);
  }

  function changeCard() {
    card.classList.add("fly-down");
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % CARD_KEYS.length;
      applyCard(CARD_KEYS[currentIndex]);
      card.classList.remove("fly-down");
      card.classList.add("fall-from-top");
      setTimeout(() => {
        card.classList.remove("fall-from-top");
        card.classList.add("floating");
      }, 500);
    }, 1000);
  }

  card.addEventListener("animationend", () => {
    if (card.classList.contains("fall-from-top")) {
      card.classList.remove("fall-from-top");
      card.classList.add("floating");
    }
  }, { once: true });

  applyCard(CARD_KEYS[currentIndex]);

  setInterval(changeCard, 5000);
}
