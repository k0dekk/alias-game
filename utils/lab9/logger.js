const LOG_LEVELS = {
  DEBUG: 1,
  INFO: 2,
  ERROR: 3,
};

/**
 * @param {Object} options
 * @param {string} options.level (DEBUG, INFO, ERROR)
 * @param {string} options.format (text / json)
 */

export function log({ level = "INFO", format = "text" } = {}) {
  const currentLevelValue = LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO;

  // Повертаємо функцію, яка приймає оригінальну функцію для обгортання
  return function (originalFunction) {
    return function (...args) {
      const functionName = originalFunction.name || "anonymous";
      const timestamp = new Date().toISOString();

      // Допоміжна функція для виводу логів
      const printLog = (logLevel, logData) => {
        if (LOG_LEVELS[logLevel] >= currentLevelValue) {
          if (format === "json") {
            console[logLevel.toLowerCase()](JSON.stringify({ timestamp, level: logLevel, function: functionName, ...logData }));
          } else {
            console[logLevel.toLowerCase()](`[${timestamp}] [${logLevel}] ${functionName}:`, logData);
          }
        }
      };

      // Логуємо вхідні аргументи (рівень INFO або DEBUG)
      if (currentLevelValue <= LOG_LEVELS.INFO) {
        printLog("INFO", { message: "Функція викликана", args });
      }

      const start = performance.now();

      try {
        const result = originalFunction.apply(this, args);

        // синхронна
        const duration = (performance.now() - start).toFixed(2);
        if (currentLevelValue <= LOG_LEVELS.DEBUG) {
          printLog("DEBUG", { message: "Виконано (синхронно)", durationMs: duration, result });
        }
        return result;

      } catch (error) {
        // синхронні помилки
        const duration = (performance.now() - start).toFixed(2);
        printLog("ERROR", { message: "Критична помилка", durationMs: duration, error: error.message });
        throw error;
      }

      const result = originalFunction.apply(this, args);
      return result;
    };
  };
}