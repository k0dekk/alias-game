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
      const result = originalFunction.apply(this, args);
      return result;
    };
  };
}