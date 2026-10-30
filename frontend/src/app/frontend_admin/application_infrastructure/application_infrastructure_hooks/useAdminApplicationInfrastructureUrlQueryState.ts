'use client';

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/** Shared pending query strings prevent setters from dropping one another's updates before router re-render. */
const latestQueryByPath = new Map<string, string>();
const pendingQueryByPath = new Map<string, string>();

/** Options for a URL-backed primitive UI state value. */
export interface AdminApplicationInfrastructureUrlQueryStateOptions<T extends string | number | null> {
  /** Finite allowed values for filters/sort fields; unknown URL values fall back safely. */
  validValues?: readonly T[];
  /** Disable URL synchronization while retaining local state behavior. */
  enabled?: boolean;
  /** Remove the query key when the value equals the default. Defaults to true. */
  omitDefault?: boolean;
}

/**
 * Synchronizes shareable search, filter, sorting and pagination state with URL query parameters.
 * Preserves unrelated query parameters and follows browser back/forward navigation. It is UI state,
 * never a cache for API responses or a replacement for server-side authorization.
 */
export function useAdminApplicationInfrastructureUrlQueryState<T extends string | number | null>(
  queryKey: string,
  defaultValue: T,
  options: AdminApplicationInfrastructureUrlQueryStateOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const enabled = options.enabled !== false;
  const omitDefault = options.omitDefault !== false;
  const validValues = options.validValues;
  const validValuesSignature = validValues?.map((candidate) => String(candidate)).join('\u0000') ?? '';
  const [value, setValue] = useState<T>(() => enabled ? parseUrlValueFromSignature(searchParams.get(queryKey), defaultValue, validValuesSignature) : defaultValue);
  const valueRef = useRef(value);
  valueRef.current = value;

  // URL state is authoritative on initial load and browser history navigation.
  useEffect(() => {
    if (!enabled) return;
    const nextValue = parseUrlValueFromSignature(new URLSearchParams(queryString).get(queryKey), defaultValue, validValuesSignature);
    const pendingQuery = pendingQueryByPath.get(pathname);
    if (pendingQuery !== undefined && pendingQuery !== queryString) return; // Ignore a stale render while router.replace is still applying the queued mutation.
    latestQueryByPath.set(pathname, queryString);
    if (pendingQuery === queryString) pendingQueryByPath.delete(pathname);
    valueRef.current = nextValue;
    setValue((currentValue) => Object.is(currentValue, nextValue) ? currentValue : nextValue);
  // validValues is represented by its stable serialized signature to avoid re-syncing on each render.
  }, [defaultValue, enabled, pathname, queryKey, queryString, validValuesSignature]);

  const setUrlBackedValue = useCallback<Dispatch<SetStateAction<T>>>((nextValue) => {
    const resolvedValue = resolveAdminApplicationInfrastructureNextValue(valueRef.current, nextValue);
    valueRef.current = resolvedValue;
    setValue(resolvedValue);
    if (!enabled) return;
    const baseQuery = latestQueryByPath.get(pathname) ?? queryString;
    const serialized = applyAdminApplicationInfrastructureQueryMutation(baseQuery, queryKey, resolvedValue, defaultValue, omitDefault);
    latestQueryByPath.set(pathname, serialized);
    pendingQueryByPath.set(pathname, serialized);
    const nextUrl = serialized ? `${pathname}?${serialized}` : pathname;
    const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;
    if (nextUrl !== currentUrl) router.replace(nextUrl, { scroll: false });
  }, [defaultValue, enabled, omitDefault, pathname, queryKey, queryString, router]);

  return [value, setUrlBackedValue];
}

function parseUrlValueFromSignature<T extends string | number | null>(rawValue: string | null, fallback: T, signature: string): T {
  if (rawValue === null) return fallback;
  if (signature && !signature.split('\u0000').includes(rawValue)) return fallback;
  if (typeof fallback === 'number') {
    const parsed = Number(rawValue);
    return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed as T : fallback;
  }
  return rawValue as T;
}

/** Pure parser shared by the hook and unit tests. */
export function parseAdminApplicationInfrastructureUrlValue<T extends string | number | null>(
  rawValue: string | null,
  fallback: T,
  validValues?: readonly T[],
): T {
  if (rawValue === null) return fallback;
  if (validValues?.length && !validValues.some((candidate) => String(candidate) === rawValue)) return fallback;
  if (typeof fallback === 'number') {
    const parsed = Number(rawValue);
    return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed as T : fallback;
  }
  return rawValue as T;
}

/** Pure immutable query mutation; useful for verifying that separate keys preserve one another. */
export function applyAdminApplicationInfrastructureQueryMutation<T extends string | number | null>(queryString: string, queryKey: string, value: T, defaultValue: T, omitDefault = true): string {
  const params = new URLSearchParams(queryString);
  if (omitDefault && Object.is(value, defaultValue)) params.delete(queryKey);
  else params.set(queryKey, String(value));
  return params.toString();
}

/** Resolves React-style functional updates against the most recently applied value. */
export function resolveAdminApplicationInfrastructureNextValue<T>(currentValue: T, nextValue: SetStateAction<T>): T {
  return typeof nextValue === 'function' ? (nextValue as (current: T) => T)(currentValue) : nextValue;
}
