import { apiProxy } from "./apiProxy.js";
import { auth } from "./firebase.js";
import { log } from "./logger.js";

// обертаємо асинхронну функцію
export const loadRemoteWordPack = log({ level: "DEBUG" })(
  async function loadRemoteWordPack(packName, isPrivate = false) {
    const authType = isPrivate ? "JWT" : "API_KEY";
    const collection = isPrivate ? "custom_packs" : "public_packs";
    
    const docId = isPrivate ? `${auth.currentUser?.uid}_${packName}` : packName;
    const endpoint = `/${collection}/${docId}`;

    const response = await apiProxy.fetch(endpoint, { method: "GET" }, authType);
    if (!response.ok) return [];

    const rawData = await response.json();
    const formattedWords = [];

    if (rawData.fields?.words?.arrayValue?.values) {
      const items = rawData.fields.words.arrayValue.values;
      items.forEach(item => {
        const fields = item.mapValue?.fields;
        if (fields) {
          formattedWords.push({
            word: fields.word?.stringValue || "",
            priority: parseInt(fields.priority?.integerValue || "1", 10)
          });
        }
      });
    }
    return formattedWords;
  }
);

// тікі помилки з форматом JSON
export const saveCustomWordPack = log({ level: "ERROR", format: "json" })(
  async function saveCustomWordPack(packName, wordsArray) {
    if (!auth.currentUser) return false;
    
    const uid = auth.currentUser.uid;
    const docId = `${uid}_${packName}`;
    const endpoint = `/custom_packs/${docId}`;

    const firestoreWords = wordsArray.map(item => ({
      mapValue: {
        fields: {
          word: { stringValue: item.word },
          priority: { integerValue: String(item.priority || 1) }
        }
      }
    }));

    const bodyPayload = {
      fields: {
        userId: { stringValue: uid },
        packName: { stringValue: packName },
        words: { arrayValue: { values: firestoreWords } }
      }
    };

    const response = await apiProxy.fetch(endpoint, {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPayload)
    }, "JWT"); 

    return response.ok;
  }
);