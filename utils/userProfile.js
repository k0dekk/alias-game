import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase.js";

const USERS = "users";

function defaultNameFromEmail(email) {
  if (!email) return "Player";
  const part = email.split("@")[0] || "Player";
  return part.slice(0, 24);
}

/**
 * @param {import("firebase/auth").User} user
 */
export async function ensureUserProfile(user) {
  if (!user?.uid) return null;
  const refDoc = doc(db, USERS, user.uid);
  const snap = await getDoc(refDoc);
  if (snap.exists()) {
    return snap.data();
  }
  const displayName = defaultNameFromEmail(user.email);
  const data = {
    displayName,
    photoURL: "",
    avatarPreset: 0,
    gamesPlayed: 0,
    wordsGuessed: 0,
    wordsSkipped: 0,
    createdAt: serverTimestamp(),
  };
  await setDoc(refDoc, data);
  return data;
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function updateUserProfile(uid, patch) {
  await updateDoc(doc(db, USERS, uid), patch);
}

export async function uploadUserAvatar(uid, file) {
  const ext = (file.name.split(".").pop() || "jpg").slice(0, 8);
  const safe = /^[a-z0-9]+$/i.test(ext) ? ext : "jpg";
  const storageRef = ref(storage, `avatars/${uid}.${safe}`);
  await uploadBytes(storageRef, file, { contentType: file.type || "image/jpeg" });
  return getDownloadURL(storageRef);
}

export async function incrementGamesPlayed(uid) {
  const refDoc = doc(db, USERS, uid);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) {
    await setDoc(refDoc, {
      displayName: "Player",
      photoURL: "",
      avatarPreset: 0,
      gamesPlayed: 1,
      createdAt: serverTimestamp(),
    });
    return;
  }
  await updateDoc(refDoc, { gamesPlayed: increment(1) });
}

export const AVATAR_PRESET_COUNT = 8;

export async function saveRoundStats(uid, guessed, skipped) {
  const refDoc = doc(db, USERS, uid);
  await updateDoc(refDoc, {
    gamesPlayed: increment(1),
    wordsGuessed: increment(guessed),
    wordsSkipped: increment(skipped)
  });
}