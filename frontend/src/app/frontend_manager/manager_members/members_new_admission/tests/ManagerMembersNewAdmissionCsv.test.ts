import { describe, expect, it } from 'vitest';
import { sanitizeManagerNewAdmissionCsvCell } from '@/app/frontend_manager/manager_members/members_new_admission/utils/ManagerMembersNewAdmissionCsv';

describe('ManagerMembersNewAdmissionCsv', () => {
  it('neutralizes spreadsheet formula prefixes, including leading whitespace/control characters', () => {
    for (const value of ['=1+1', '+cmd', '-1+2', '@SUM(A1:A2)', '  =1+1', '\t=1+1', '\uFEFF=1+1']) {
      expect(sanitizeManagerNewAdmissionCsvCell(value)).toMatch(/^"'/);
    }
  });
  it('preserves ordinary values and correctly escapes CSV quotes', () => {
    expect(sanitizeManagerNewAdmissionCsvCell('Ada Lovelace')).toBe('"Ada Lovelace"');
    expect(sanitizeManagerNewAdmissionCsvCell('O"Brien, Jr')).toBe('"O""Brien, Jr"');
    expect(sanitizeManagerNewAdmissionCsvCell('')).toBe('""');
  });
});
