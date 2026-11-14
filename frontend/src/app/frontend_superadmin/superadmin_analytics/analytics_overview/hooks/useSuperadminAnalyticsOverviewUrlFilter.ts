// RESPONSIBILITY: Own module-local state or interaction logic for analytics overview; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_analytics/analytics_overview/hooks/useSuperadminAnalyticsOverviewUrlFilter.ts -> local state/typed dependencies -> returned state and actions.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Builds a query string while preserving unrelated report-view parameters. */
export function buildSuperadminReportsFilterSearch<T extends string>(
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
 * Persists report preview filters in URL query state for refresh and browser
 * history. This is client-side view state, not a reporting API contract.
 
 * @param key - Input supplied by the caller under the declared TypeScript contract.
 * @param fallback - Input supplied by the caller under the declared TypeScript contract.
 * @param allowedValues - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminAnalyticsOverviewUrlFilter<T extends string>(
  key: string,
  fallback: T,
  allowedValues: readonly T[],
): readonly [T, (nextValue: T) => void] {
  const [value, setValueState] = useState<T>(fallback);
  const allowedValuesRef = useRef(allowedValues);
  allowedValuesRef.current = allowedValues;

  const readCurrentValue = useCallback((): T => {
    const candidate = new URLSearchParams(window.location.search).get(key);
    return candidate && allowedValuesRef.current.includes(candidate as T) ? candidate as T : fallback;
  }, [fallback, key]);

  // Effect contract: keep local filter state synchronized with browser back/forward navigation and remove the listener on cleanup; dependency set [readCurrentValue] is the deliberate re-run boundary.
  useEffect(() => {
    setValueState(readCurrentValue());
    const handlePopState = () => setValueState(readCurrentValue());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [readCurrentValue]);

  const setValue = useCallback((nextValue: T) => {
    setValueState(nextValue);
    const query = buildSuperadminReportsFilterSearch(window.location.search, key, fallback, nextValue);
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.pushState(window.history.state, '', nextUrl);
  }, [fallback, key]);

  return [value, setValue] as const;
}
