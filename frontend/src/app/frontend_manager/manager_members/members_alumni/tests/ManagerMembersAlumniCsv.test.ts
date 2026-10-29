import { describe, expect, it } from 'vitest';
import { sanitizeManagerAlumniCsvCell } from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniCsv';

describe('ManagerMembersAlumniCsv', () => {
  it('neutralizes spreadsheet formula prefixes, including leading whitespace/control characters', () => {
    for (const value of ['=1+1', '+cmd', '-1+2', '@SUM(A1:A2)', '  =1+1', '\t=1+1', '\uFEFF=1+1']) {
      expect(sanitizeManagerAlumniCsvCell(value)).toMatch(/^"'/);
    }
  });
  it('preserves ordinary values and correctly escapes CSV quotes', () => {
    expect(sanitizeManagerAlumniCsvCell('Ada Lovelace')).toBe('"Ada Lovelace"');
    expect(sanitizeManagerAlumniCsvCell('O"Brien, Jr')).toBe('"O""Brien, Jr"');
    expect(sanitizeManagerAlumniCsvCell('')).toBe('""');
  });
});
