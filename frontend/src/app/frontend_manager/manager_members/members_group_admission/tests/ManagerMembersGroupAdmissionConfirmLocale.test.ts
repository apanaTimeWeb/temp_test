import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const english = JSON.parse(readFileSync(new URL('../locales/manager_members_group_admission_domain_en.json', import.meta.url), 'utf8')) as unknown;
const hindi = JSON.parse(readFileSync(new URL('../locales/manager_members_group_admission_domain_hi.json', import.meta.url), 'utf8')) as unknown;
function findKey(value: unknown, key: string): unknown {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(record, key)) return record[key];
  for (const child of Object.values(record)) { const found = findKey(child, key); if (found !== undefined) return found; }
  return undefined;
}

describe('confirmation dialog locale contract', () => {
  it('provides translated Continue labels for both supported locales', () => {
    expect(findKey(english, 'continue')).toBe('Continue');
    expect(findKey(hindi, 'continue')).toBe('जारी रखें');
    expect(findKey(english, 'confirm_leave_with_unsaved_changes')).toBeTruthy();
    expect(findKey(hindi, 'confirm_leave_with_unsaved_changes')).toBeTruthy();
  });
});
