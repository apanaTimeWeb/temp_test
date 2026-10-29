export function displayValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

