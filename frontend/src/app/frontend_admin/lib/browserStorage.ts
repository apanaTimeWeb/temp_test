/** Shared, SSR-safe browser storage boundary. Business modules must validate parsed values themselves. */
export type BrowserStorageReadResult =
  | { available: true; value: string | null }
  | { available: false; value: null };

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readBrowserStorageItem(key: string): BrowserStorageReadResult {
  const storage = getLocalStorage();
  if (!storage) return { available: false, value: null };
  try {
    return { available: true, value: storage.getItem(key) };
  } catch {
    return { available: false, value: null };
  }
}

/** Writes fail loudly so callers cannot mistake an unavailable browser store for persistence. */
export function writeBrowserStorageItem(key: string, value: string): void {
  const storage = getLocalStorage();
  if (!storage) throw new Error('Browser storage is unavailable in this environment.');
  try {
    storage.setItem(key, value);
  } catch (error) {
    throw new Error('Browser storage could not persist the requested value.', { cause: error });
  }
}

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function readBrowserSessionStorageItem(key: string): BrowserStorageReadResult {
  const storage = getSessionStorage();
  if (!storage) return { available: false, value: null };
  try {
    return { available: true, value: storage.getItem(key) };
  } catch {
    return { available: false, value: null };
  }
}

export function writeBrowserSessionStorageItem(key: string, value: string): void {
  const storage = getSessionStorage();
  if (!storage) throw new Error('Browser session storage is unavailable in this environment.');
  try {
    storage.setItem(key, value);
  } catch (error) {
    throw new Error('Browser session storage could not persist the requested value.', { cause: error });
  }
}
