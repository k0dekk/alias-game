import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

export async function checkTeamNameValid(teamName, signal = null) {
  // 1. перевірка на випадок, якщо AbortController спрацював на самому старті
  if (signal?.aborted) {
    throw new DOMException(`Валідацію скасовано`, 'AbortError');
  }

  // 2. шукаємо в колекції "banned_teams" документ, де поле "name" дорівнює введеній назві
  const q = query(
    collection(db, "banned_teams"), 
    where("name", "==", teamName.trim().toLowerCase())
  );

  try {
    // 3. робимо запит до серверів Firebase
    const querySnapshot = await getDocs(q);

    // 4. перевіряємо, чи юзер не скасував запит
    if (signal?.aborted) {
      throw new DOMException(`Валідацію скасовано`, 'AbortError');
    }

    // 5. Якщо querySnapshot не порожній, значить таке слово є в чорному списку
    const isBanned = !querySnapshot.empty;
    
    console.log(`[Firestore] Перевірка '${teamName}' | Заборонено: ${isBanned}`);
    return isBanned;

  } catch (error) {
    if (error.name === 'AbortError') throw error; 
    
    console.error(error);
    return false; // У разі помилки мережі дозволяємо грати, щоб не ламати гру
  }
}