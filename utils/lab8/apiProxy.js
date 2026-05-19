import { auth } from "./firebase.js";

export class AuthProxy {
  constructor() {
    this.projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    this.apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    this.baseUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents`;
  }

  async fetch(endpoint, options = {}, authType = "API_KEY") {
    const config = { ...options };
    config.headers = new Headers(options.headers || {});
    
    let url = `${this.baseUrl}${endpoint}`;

    if (authType === "API_KEY") {
      const separator = url.includes("?") ? "&" : "?";
      url = `${url}${separator}key=${this.apiKey}`;
    } 

    else if (authType === "JWT") {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        config.headers.append("Authorization", `Bearer ${token}`);
      } else {
        console.warn("[API Proxy] cпроба використати JWT без авторизації");
      }
    }

    try {
      const response = await window.fetch(url, config);
      return response;
    } catch (error) {
      console.error("[API Proxy] помилка запиту через проксі:", error);
      throw error;
    }
  }
}

export const apiProxy = new AuthProxy();