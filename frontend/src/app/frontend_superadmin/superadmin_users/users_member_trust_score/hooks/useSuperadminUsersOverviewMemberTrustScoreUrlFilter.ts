// RESPONSIBILITY: Own module-local state or interaction logic for users member trust score; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_users/users_member_trust_score/hooks/useSuperadminUsersOverviewMemberTrustScoreUrlFilter.ts -> local state/typed dependencies -> returned state and actions.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Builds a query string while preserving unrelated finance-view parameters. */
export function buildSuperadminFinanceFilterSearch<T extends string>(
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

/** Reads only an allowlisted structured filter value from a URL query string. */
export function readSuperadminFinanceFilterValue<T extends string>(
  search: string,
  key: string,
  fallback: T,
  allowedValues?: readonly T[],
): T {
  const candidate = new URLSearchParams(search).get(key);
  return candidate && (!allowedValues || allowedValues.includes(candidate as T)) ? candidate as T : fallback;
}

/**
 * Keeps non-sensitive finance filter state shareable across refresh and history.
 * Free-text searches are deliberately not persisted here because they may contain
 * student names, IDs, phone numbers, or other sensitive identifiers.
 
 * @param key - Input supplied by the caller under the declared TypeScript contract.
 * @param fallback - Input supplied by the caller under the declared TypeScript contract.
 * @param allowedValues - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminUsersOverviewMemberTrustScoreUrlFilter<T extends string>(
  key: string,
  fallback: T,
  allowedValues?: readonly T[],
): readonly [T, (nextValue: T) => void] {
  const [value, setValueState] = useState<T>(fallback);
  const allowedValuesRef = useRef(allowedValues);
  allowedValuesRef.current = allowedValues;

  const readCurrentValue = useCallback((): T => {
    return readSuperadminFinanceFilterValue(window.location.search, key, fallback, allowedValuesRef.current);
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
    const query = buildSuperadminFinanceFilterSearch(window.location.search, key, fallback, nextValue);
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, [fallback, key]);

  return [value, setValue] as const;
}
