
// callback version
export function asyncSomeCallback(arr, predicate, cb) {
  // рекурсивна функція для ітерації по масиву
  function next(i) {
    if (i >= arr.length) return cb(null, false);

    predicate(arr[i], i, arr, (err, res) => {
      if (err) return cb(err);
      if (res) return cb(null, true);
      next(i + 1);
    });
  }
  next(0);
}

// promise version
export async function asyncSomePromise(arr, predicate) {
  for (let i = 0; i < arr.length; i++) {
    const res = await predicate(arr[i], i, arr);
    // short-circuit: якщо хоч один елемент задовольняє умову, повертаємо true і припиняємо ітерацію
    if (res) return true;
  }
  return false;
}

// promise version with abort support
export async function asyncSomePromiseAbortable(arr, predicate, signal) {
  for (let i = 0; i < arr.length; i++) {
    if (signal?.aborted) {
      throw new DOMException('Iteration aborted', 'AbortError');
    }
    
    const res = await predicate(arr[i], i, arr, signal);
    if (res) return true;
  }
  return false;
}