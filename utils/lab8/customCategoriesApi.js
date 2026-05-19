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

export async function getCustomCategories(uid) {
  const res = await apiProxy.fetch(`/users/${uid}/customCategories`, {}, "JWT");
  if (!res.ok) return [];
  
  const data = await res.json();
  if (!data.documents) return [];

  return data.documents.map(doc => {
    const id = doc.name.split('/').pop();
    const name = doc.fields?.name?.stringValue || "Без назви";
    const wordsRaw = doc.fields?.words?.arrayValue?.values || [];
    
    const words = wordsRaw.map(v => {
      if (v.mapValue && v.mapValue.fields) {
        return {
          word: v.mapValue.fields.word?.stringValue || "",
          difficulty: v.mapValue.fields.difficulty?.stringValue || "easy"
        };
      }

      if (v.stringValue) {
        return {
          word: v.stringValue,
          difficulty: "easy"
        };
      }

      return { word: "", difficulty: "easy" };
    }).filter(w => w.word.trim().length > 0);

    return { id, name, words, isCustom: true };
  });
}

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