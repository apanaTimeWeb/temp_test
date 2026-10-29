'use client';
/** DATA FLOW: Caller value -> debounced value returned to the feature component; no network flow is introduced. */

import { useState, useEffect } from 'react';

// RESPONSIBILITY: Provides a debounced value for search inputs to prevent excessive re-renders/API calls.

export function useManagerGroupAdmissionDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Dependency rationale: restart the debounce timer whenever the input value or delay changes.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
