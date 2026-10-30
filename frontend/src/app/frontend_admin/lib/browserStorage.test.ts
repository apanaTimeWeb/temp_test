import { afterEach, describe, expect, it, vi } from 'vitest';
import { readBrowserStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe('shared browser storage boundary', () => {
  it('distinguishes an available empty key from unavailable storage', () => {
    expect(readBrowserStorageItem('missing')).toEqual({ available: true, value: null });
  });

  it('writes and reads values through the shared adapter', () => {
    writeBrowserStorageItem('example_v1', '{"version":1}');
    expect(readBrowserStorageItem('example_v1')).toEqual({ available: true, value: '{"version":1}' });
  });

  it('does not pretend persistence succeeded when storage access is unavailable', () => {
    vi.stubGlobal('window', undefined);
    expect(readBrowserStorageItem('example_v1')).toEqual({ available: false, value: null });
    expect(() => writeBrowserStorageItem('example_v1', 'value')).toThrow('Browser storage is unavailable');
  });
});
