import { describe, expect, it } from 'vitest';
import { sanitizeManagerSeatMatrixCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/utils/ManagerSeatsMatrixCsv';

describe('ManagerSeatsMatrixCsv', () => {
  it('neutralizes spreadsheet formula prefixes, including leading whitespace/control characters', () => {
    for (const value of ['=1+1', '+cmd', '-1+2', '@SUM(A1:A2)', '  =1+1', '\t=1+1', '\uFEFF=1+1']) {
      expect(sanitizeManagerSeatMatrixCsvCell(value)).toMatch(/^"'/);
    }
  });
  it('preserves ordinary values and correctly escapes CSV quotes', () => {
    expect(sanitizeManagerSeatMatrixCsvCell('Ada Lovelace')).toBe('"Ada Lovelace"');
    expect(sanitizeManagerSeatMatrixCsvCell('O"Brien, Jr')).toBe('"O""Brien, Jr"');
    expect(sanitizeManagerSeatMatrixCsvCell('')).toBe('""');
  });
});
