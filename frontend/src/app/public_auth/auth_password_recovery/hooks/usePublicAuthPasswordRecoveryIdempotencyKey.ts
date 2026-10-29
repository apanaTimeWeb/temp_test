'use client';
import { useCallback, useRef } from 'react';

/** One cryptographically generated key per unchanged recovery intent; no payload is stored. */
export function usePublicAuthPasswordRecoveryIdempotencyKey() {
  const keyRef = useRef<string | null>(null);
  const getKey = useCallback(async (): Promise<string> => {
    if (!globalThis.crypto?.randomUUID) throw new Error('SECURE_REQUEST_KEY_UNAVAILABLE');
    if (!keyRef.current) keyRef.current = globalThis.crypto.randomUUID();
    return keyRef.current;
  }, []);
  const clearKey = useCallback(() => { keyRef.current = null; }, []);
  return { getKey, clearKey };
}
