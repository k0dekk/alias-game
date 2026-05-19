# logger.js

**Decorator Pattern**

## Testing:

Open your browser's Developer Tools to watch the decorator in action:

1. **Sync Function (`createGame`):**
   * Simply click the Play button on the main screen.
   * **Result:** You will see a log displaying the input arguments, execution time, and the return value of the game instance.

2. **Async Function (`loadRemoteWordPack`):**
   * Trigger this by saving, loading, or changing category word packs in the game settings.
   * Alternatively, run this dummy call directly inside your browser console:
     ```javascript
     import("./src/lab9/wordService.js").then(m => m.loadRemoteWordPack("animals"));
     ```
   * **Result:** The console will trace the asynchronous lifecycle (`Promise` resolution/rejection) along with precise time profiling in milliseconds (`ms`).


## code architecture

* **`log()` Wrapper (`logger.js`)**: The "middleman" or spy glass. It sits around existing functions like a shell. When a function gets called, it checks the clock, logs the inputs, lets the function do its job, checks the clock again, and logs the final result.
* **`loadRemoteWordPack` (`wordService.js`)**: The async target. It is wrapped in `log({ level: "DEBUG" })`. It talks to the API, and the decorator silently prints detailed timing logs on successful network requests.
* **`saveCustomWordPack` (`wordService.js`)**: The error-only target. It is wrapped with `level: "ERROR"`. It runs quietly in the background and only prints structured JSON to the console if something breaks or a network request fails.