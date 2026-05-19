import { apiProxy } from "./apiProxy.js";

export async function saveCustomCategory(uid, categoryId, name, wordsArray) {
  const payload = {
    fields: {
      name: { stringValue: name },
      words: {
        arrayValue: {
          values: wordsArray.map(item => ({
            mapValue: {
              fields: {
                word: { stringValue: item.word.trim() },
                difficulty: { stringValue: item.difficulty }
              }
            }
          }))
        }
      }
    }
  };

  const res = await apiProxy.fetch(
    `/users/${uid}/customCategories?documentId=${categoryId}`,
    { 
      method: "POST", 
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    },
    "JWT"
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Деталі помилки від Firestore:", errorData);
    throw new Error("Помилка збереження категорії");
  }

  return res.json();
}