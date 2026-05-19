import { auth } from "./firebase.js";

export class AuthProxy {
  constructor() {
    // змінні
    this.projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    this.baseUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents`;
  }

  // обгортка для HTTP-запитів
  async fetch(endpoint, options = {}) {
    const config = { ...options };
    config.headers = new Headers(options.headers || {});
    
    // шлях до Firestore REST API
    let url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await window.fetch(url, config);
      return response;
    } catch (error) {
      console.error("[API Proxy] Помилка запиту через проксі:", error);
      throw error;
    }
  }
}

export const apiProxy = new AuthProxy();