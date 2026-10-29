'use client';
import { useCallback, useRef } from 'react';
/** Per-form-intent key; values are never persisted or derived from credentials. */
export function usePublicAuthPasswordResetIdempotencyKey() {
 const keyRef = useRef<string | null>(null);
 const getKey = useCallback(async (): Promise<string> => { const cryptoApi = globalThis.crypto; if (!cryptoApi?.randomUUID) throw new Error('SECURE_REQUEST_KEY_UNAVAILABLE'); if (!keyRef.current) keyRef.current = cryptoApi.randomUUID(); return keyRef.current; }, []);
 const clearKey = useCallback(() => { keyRef.current = null; }, []);
 return { getKey, clearKey };
}
