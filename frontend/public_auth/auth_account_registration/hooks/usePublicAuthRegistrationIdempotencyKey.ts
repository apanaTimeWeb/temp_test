'use client';

import { useCallback, useRef } from 'react';

/**
 * Owns one random idempotency key for the current, unchanged form intent.
 * Privacy boundary: never serializes, hashes, or retains credentials or form payloads.
 * Retry behavior: an unchanged form reuses its key after a failed request; form-value changes clear the key via the owning page's React Hook Form subscription.
 * Failure behavior: if the browser cannot produce a secure UUID, callers fail closed rather than sending a request without an idempotency key.
 */
export function usePublicAuthRegistrationIdempotencyKey() {
  const keyRef = useRef<string | null>(null);

  const getKey = useCallback(async (): Promise<string> => {
    const cryptoApi = globalThis.crypto;
    if (!cryptoApi?.randomUUID) throw new Error('SECURE_REQUEST_KEY_UNAVAILABLE');
    if (!keyRef.current) keyRef.current = cryptoApi.randomUUID();
    return keyRef.current;
  }, []);

  const clearKey = useCallback(() => {
    keyRef.current = null;
  }, []);

  return { getKey, clearKey };
}
