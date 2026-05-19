import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase.js";

export async function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}

export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function logoutUser() {
  return signOut(auth);
}
