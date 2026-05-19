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