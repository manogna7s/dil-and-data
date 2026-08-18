let ready = false;
const waiters = [];

export function setDatabaseReady(value) {
  ready = Boolean(value);
  if (ready) {
    while (waiters.length) waiters.pop()?.();
  }
}

export function isDatabaseReady() {
  return ready;
}

export function whenDatabaseReady(timeoutMs = 25000) {
  if (ready) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Database is still connecting"));
    }, timeoutMs);
    waiters.push(() => {
      clearTimeout(timer);
      resolve();
    });
  });
}
