'use client';
/** DATA FLOW: URL search parameters -> module-owned filter state -> feature view; no backend request is implied. */

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type ManagerFinanceLateFeesUrlFilterRule = {
  defaultValue: string;
  allowedValues?: readonly string[];
};

type RuleValue<Rule> = Rule extends { allowedValues: readonly (infer Value)[] } ? Value : string;
type FilterValues<Config extends Record<string, ManagerFinanceLateFeesUrlFilterRule>> = {
  [Key in keyof Config]: RuleValue<Config[Key]>;
};

/**
 * Keeps module-owned, presentation-only finance filters in the current URL.
 * It preserves unrelated query parameters and rejects enum values outside
 * the options already declared by each control. It does not imply data access
 * or enable any financial mutation.
 */
export function useManagerLateFeesUrlFilters<Config extends Record<string, ManagerFinanceLateFeesUrlFilterRule>>(config: Config) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const readValues = useCallback((params: { get: (name: string) => string | null }) => {
    const result: Record<string, string> = {};
    for (const [key, rule] of Object.entries(config)) {
      const fromUrl = params.get(key);
      const candidate = fromUrl === null ? rule.defaultValue : fromUrl;
      result[key] = rule.allowedValues && !rule.allowedValues.includes(candidate)
        ? rule.defaultValue
        : candidate;
    }
    return result as FilterValues<Config>;
  }, [config]);

  const [values, setValues] = useState<FilterValues<Config>>(() => readValues(searchParams));

  // Dependency rationale: URL-derived filter values must be reconciled when config, parser, or search params change.
  useEffect(() => {
    const fromUrl = readValues(searchParams);
    setValues((current) => Object.keys(config).every((key) => current[key as keyof Config] === fromUrl[key as keyof Config]) ? current : fromUrl);
  }, [config, readValues, searchParams]);

  const setValue = useCallback(<Key extends keyof Config>(key: Key, value: string) => {
    const keyName = String(key);
    const rule = config[keyName];
    if (!rule) return;
    const nextValue = rule.allowedValues && !rule.allowedValues.includes(value) ? rule.defaultValue : value;
    setValues((current) => ({ ...current, [key]: nextValue }));

    const params = new URLSearchParams(searchParams.toString());
    if (nextValue === rule.defaultValue || nextValue === '') params.delete(keyName);
    else params.set(keyName, nextValue);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [config, pathname, router, searchParams]);

  return { values, setValue };
}
