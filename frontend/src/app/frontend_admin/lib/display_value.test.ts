import { describe, expect, it } from 'vitest';
import { displayValue } from '@/lib/display_value';

describe('displayValue', () => {
  it.each([null, undefined, '', '   '])('uses the fallback for blank nullable values: %s', (value) => {
    expect(displayValue(value)).toBe('—');
  });
  it('preserves meaningful zero and false values', () => {
    expect(displayValue(0)).toBe('0');
    expect(displayValue(false)).toBe('false');
  });
  it('preserves non-empty strings and supports a custom fallback', () => {
    expect(displayValue(' Member ')).toBe(' Member ');
    expect(displayValue(null, 'Unknown')).toBe('Unknown');
  });
});
