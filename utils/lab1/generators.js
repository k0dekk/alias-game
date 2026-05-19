export function* roundRobinGenerator(items) {
  let index = 0;
  while (true) {
    yield items[index];
    index = (index + 1) % items.length;
  }
}

export function consumeIteratorWithTimeout(iterator, timeoutSec, processFn) {
  return new Promise((resolve) => {
    setInterval(() => {
      const { value } = iterator.next();
      processFn(value);
    }, 1000);
  });
}