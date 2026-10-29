import { describe, expect, it } from 'vitest';
import { sanitizeManagerAllocationsCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/utils/ManagerSeatsAllocationsCsv';

describe('ManagerSeatsAllocationsCsv', () => {
  it('neutralizes spreadsheet formula prefixes, including leading whitespace/control characters', () => {
    for (const value of ['=1+1', '+cmd', '-1+2', '@SUM(A1:A2)', '  =1+1', '\t=1+1', '\uFEFF=1+1']) {
      expect(sanitizeManagerAllocationsCsvCell(value)).toMatch(/^"'/);
    }
  });
  it('preserves ordinary values and correctly escapes CSV quotes', () => {
    expect(sanitizeManagerAllocationsCsvCell('Ada Lovelace')).toBe('"Ada Lovelace"');
    expect(sanitizeManagerAllocationsCsvCell('O"Brien, Jr')).toBe('"O""Brien, Jr"');
    expect(sanitizeManagerAllocationsCsvCell('')).toBe('""');
  });
});
