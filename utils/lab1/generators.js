/*

Генератор для випадкового вибору категорій слів в модальному вікні на settingsScreen.js

*/
export function* roundRobinGenerator(items) {
  let index = Math.floor(Math.random() * items.length);
  while (true) {
    yield items[index];
    index = (index + 1) % items.length;
  }
}

export function consumeIteratorWithTimeout(iterator, timeoutSec, processFn) {
  return new Promise((resolve) => {
    const timeoutMs = timeoutSec * 1000;
    const startTime = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= timeoutMs) {
        clearInterval(intervalId);
        resolve();
        return;
      }
      const { value } = iterator.next();
      
      processFn(value);
    }, 100);
  });
}