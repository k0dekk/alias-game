import wordsData from "../../words/uk.json";

function getSelectedCategoryValues(checkboxSelector) {
  const checkedBoxes = Array.from(
    document.querySelectorAll(`${checkboxSelector}:checked`)
  );

  if (checkedBoxes.length > 0) {
    return checkedBoxes
      .map((checkbox) => checkbox.value?.trim())
      .filter(Boolean);
  }

  const selectedBoxes = Array.from(document.querySelectorAll(".cat-box.selected"));
  return selectedBoxes
    .map((box) => box.dataset.category || box.dataset.value || box.textContent?.trim())
    .filter(Boolean);
}

export function filterWordsByCategories(selectedCategories, allWords = wordsData) {
  if (!Array.isArray(selectedCategories) || selectedCategories.length === 0) {
    return allWords;
  }

  const allowedCategories = new Set(selectedCategories);
  return allWords.filter((word) => allowedCategories.has(word.category));
}

export function setupCategoryFilter({
  checkboxSelector = ".category-checkbox",
  confirmButtonSelector = "#confirmCatBtn",
  allWords = wordsData,
  onFiltered,
} = {}) {
  const confirmButton = document.querySelector(confirmButtonSelector);
  if (!confirmButton) {
    return () => {};
  }

  const handleConfirm = () => {
    const selectedCategories = getSelectedCategoryValues(checkboxSelector);
    const filteredWords = filterWordsByCategories(selectedCategories, allWords);

    if (typeof onFiltered === "function") {
      onFiltered(filteredWords, selectedCategories);
    }

    document.dispatchEvent(
      new CustomEvent("words:categoriesFiltered", {
        detail: { selectedCategories, filteredWords },
      })
    );
  };

  confirmButton.addEventListener("click", handleConfirm);
  return () => confirmButton.removeEventListener("click", handleConfirm);
}
