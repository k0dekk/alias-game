# apiProxy.js

## Testing:
Since this works completely behind the scenes, you can verify it by opening your browser's Developer Tools
1. Log into your account or register a new user in the app.
2. Go to your custom categories and click Save, Load, or Delete a custom category.

**Result in Console:**
* `[API Proxy] перехоплено запит: POST -> /users/...`
* `[API Proxy] JWT Токен користувача успішно додано в Headers.`
* `[API Proxy] Отримано статус: 200 (час: 145ms)`



## code architecture

* **`apiProxy.js`**: The security guard/courier. Instead of components talking to the internet directly, they give their requests to the proxy. The proxy signs the requests with the correct key or secure token before sending them out.
* **`customCategoriesApi.js`**: The customer. When it wants to save, load, or delete a category, it doesn't use the regular `fetch()`. It calls `apiProxy.fetch()` and says to use the JWT strategy