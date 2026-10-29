import { describe, expect, it } from 'vitest';
import { sanitizeManagerShiftsCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/utils/ManagerShiftsManagementCsv';

describe('ManagerShiftsManagementCsv', () => {
  it('neutralizes spreadsheet formula prefixes, including leading whitespace/control characters', () => {
    for (const value of ['=1+1', '+cmd', '-1+2', '@SUM(A1:A2)', '  =1+1', '\t=1+1', '\uFEFF=1+1']) {
      expect(sanitizeManagerShiftsCsvCell(value)).toMatch(/^"'/);
    }
  });
  it('preserves ordinary values and correctly escapes CSV quotes', () => {
    expect(sanitizeManagerShiftsCsvCell('Ada Lovelace')).toBe('"Ada Lovelace"');
    expect(sanitizeManagerShiftsCsvCell('O"Brien, Jr')).toBe('"O""Brien, Jr"');
    expect(sanitizeManagerShiftsCsvCell('')).toBe('""');
  });
});
