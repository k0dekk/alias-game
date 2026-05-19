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

  return res.json();
}