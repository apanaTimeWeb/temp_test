import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const english = JSON.parse(readFileSync(new URL('../locales/manager_finance_collect_fee_domain_en.json', import.meta.url), 'utf8')) as unknown;
const hindi = JSON.parse(readFileSync(new URL('../locales/manager_finance_collect_fee_domain_hi.json', import.meta.url), 'utf8')) as unknown;
function findKey(value: unknown, key: string): unknown {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(record, key)) return record[key];
  for (const child of Object.values(record)) { const found = findKey(child, key); if (found !== undefined) return found; }
  return undefined;
}

describe('confirmation dialog locale contract', () => {
  it('provides translated Continue labels and Hindi unsaved-change copy', () => {
    expect(findKey(english, 'continue')).toBe('Continue');
    expect(findKey(hindi, 'continue')).toBe('जारी रखें');
    expect(String(findKey(hindi, 'confirm_leave_with_unsaved_changes'))).toMatch(/[\u0900-\u097F]/);
    expect(String(findKey(hindi, 'confirm_leave_with_unsaved_changes'))).not.toMatch(/[\u0600-\u06FF]/);
  });
});
