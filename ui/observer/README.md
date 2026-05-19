# observers.js
**Pub/Sub (Observer) pattern**

## Testing:
1. Open the app on the **StartScreen**.
2. Scroll down.

**Result:**  
* As the main hero title disappears, a small "Alias" logo smoothly appears in the header.
* The Play button changes its animation (gains the `.scrolled-state` class).
* Scrolling back up reverses both effects.

---

## code architecture:

* **`EventEmitter`:** The postal service. It registers listeners (`subscribe`) and delivers letters (`emit`).
* **`IntersectionObserver`:** The trigger. It watches the `#hero-title` and broadcasts a `"heroScrolled"` message containing `{ isHidden: true/false }` whenever the title leaves or enters the viewport.
* **UI Elements:** The independent consumers. They listen to the bus and update their own DOM classes reactively without knowing about each other's existence.