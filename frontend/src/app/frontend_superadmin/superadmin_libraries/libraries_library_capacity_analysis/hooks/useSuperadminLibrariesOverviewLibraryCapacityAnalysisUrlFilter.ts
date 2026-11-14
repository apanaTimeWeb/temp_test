// RESPONSIBILITY: Own an allow-listed local URL filter for the library capacity-analysis preview.
// FLOW: Page filter -> allow-listed URL hook -> local state and query string; no server persistence is implied.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Builds a query string while preserving unrelated parameters and omitting the fallback value. */
export function buildSuperadminAccountingFilterSearch<T extends string>(
  search: string,
  key: string,
  fallback: T,
  nextValue: T,
): string {
  const params = new URLSearchParams(search);
  if (nextValue === fallback) params.delete(key);
  else params.set(key, nextValue);
  return params.toString();
}

/**
 * Keeps a validated module-owned preview filter in URL state. Unknown query values
 * always fall back; callers must provide the complete allowed-value set.
 */
export function useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter<T extends string>(
  key: string,
  fallback: T,
  allowedValues: readonly T[],
): readonly [T, (nextValue: T) => void] {
  const [value, setValueState] = useState<T>(fallback);
  const allowedValuesRef = useRef(allowedValues);
  allowedValuesRef.current = allowedValues;

  const normalize = useCallback((candidate: string | null): T => {
    return candidate !== null && allowedValuesRef.current.includes(candidate as T)
      ? candidate as T
      : fallback;
  }, [fallback]);

  const readCurrentValue = useCallback((): T => {
    return normalize(new URLSearchParams(window.location.search).get(key));
  }, [key, normalize]);

  useEffect(() => {
    setValueState(readCurrentValue());
    const handlePopState = () => setValueState(readCurrentValue());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [readCurrentValue]);

  const setValue = useCallback((nextValue: T) => {
    const acceptedValue = allowedValuesRef.current.includes(nextValue) ? nextValue : fallback;
    setValueState(acceptedValue);
    const query = buildSuperadminAccountingFilterSearch(window.location.search, key, fallback, acceptedValue);
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, [fallback, key]);

  return [value, setValue] as const;
}
