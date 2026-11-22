/** Render nullable primitive values without hiding meaningful falsey values such as 0 or false. */
export function displayValue(value: unknown, fallback = '—'): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value.trim().length > 0 ? value : fallback;
  return String(value);
}

