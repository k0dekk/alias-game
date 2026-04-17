import ukUi from "../locales/uiWords/ukUI.json";
import enUi from "../locales/uiWords/enUi.json";

const UI_BY_LANG = { uk: ukUi, en: enUi };
const FALLBACK_LANG = "uk";
const STORAGE_KEY = "alias-lang";

let currentLanguage = localStorage.getItem(STORAGE_KEY) || FALLBACK_LANG;
if (!UI_BY_LANG[currentLanguage]) currentLanguage = FALLBACK_LANG;

document.documentElement.lang = currentLanguage;

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function t(key, vars = {}) {
  const raw =
    getByPath(UI_BY_LANG[currentLanguage], key) ??
    getByPath(UI_BY_LANG[FALLBACK_LANG], key) ??
    key;

  return Object.entries(vars).reduce((text, [name, value]) => {
    return text.replaceAll(`{${name}}`, String(value));
  }, raw);
}

export function getLanguage() {
  return currentLanguage;
}