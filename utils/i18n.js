import ukUi from "../locales/uiWords/ukUI.json";
import enUi from "../locales/uiWords/enUi.json";
import allWords from "../locales/words/uk.json"; 

const UI_BY_LANG = { uk: ukUi, en: enUi };
const FALLBACK_LANG = "uk";
const STORAGE_KEY = "alias-lang";
const listeners = new Set();

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

export function setLanguage(lang) {
  if (!UI_BY_LANG[lang] || currentLanguage === lang) return;
  currentLanguage = lang;
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  listeners.forEach(cb => cb(lang));
}

export function onLanguageChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getWords() {
  return allWords.map(item => ({
    category: item.category,
    level: item.level,
    word: item[currentLanguage] || item[FALLBACK_LANG] 
  }));
}