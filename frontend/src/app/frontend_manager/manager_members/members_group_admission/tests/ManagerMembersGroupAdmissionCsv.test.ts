import { describe, expect, it } from 'vitest';
import { sanitizeManagerGroupAdmissionCsvCell } from '@/app/frontend_manager/manager_members/members_group_admission/utils/ManagerMembersGroupAdmissionCsv';

describe('ManagerMembersGroupAdmissionCsv', () => {
  it('neutralizes spreadsheet formula prefixes, including leading whitespace/control characters', () => {
    for (const value of ['=1+1', '+cmd', '-1+2', '@SUM(A1:A2)', '  =1+1', '\t=1+1', '\uFEFF=1+1']) {
      expect(sanitizeManagerGroupAdmissionCsvCell(value)).toMatch(/^"'/);
    }
  });
  it('preserves ordinary values and correctly escapes CSV quotes', () => {
    expect(sanitizeManagerGroupAdmissionCsvCell('Ada Lovelace')).toBe('"Ada Lovelace"');
    expect(sanitizeManagerGroupAdmissionCsvCell('O"Brien, Jr')).toBe('"O""Brien, Jr"');
    expect(sanitizeManagerGroupAdmissionCsvCell('')).toBe('""');
  });
});
