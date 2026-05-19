import { auth } from "../firebase.js";

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
    
    const startTime = Date.now();
    console.log(`[API Proxy] перехоплено запит: ${config.method || 'GET'} -> ${endpoint}`);

    if (authType === "API_KEY") {
      const separator = url.includes("?") ? "&" : "?";
      url = `${url}${separator}key=${this.apiKey}`;
    } else if (authType === "JWT") {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        config.headers.append("Authorization", `Bearer ${token}`);
        console.log("[API Proxy] JWT Токен користувача успішно додано в Headers.");
      } else {
        console.warn("[API Proxy] спроба використати JWT без авторизації");
      }
    }

    try {
      const response = await window.fetch(url, config);
      
      const duration = Date.now() - startTime;
      console.log(`[API Proxy] Отримано статус: ${response.status} (час: ${duration}ms)`);
      
      return response;
    } catch (error) {
      console.error("[API Proxy] Помилка запиту через проксі:", error);
      throw error;
    }
  }
}

export const apiProxy = new AuthProxy();