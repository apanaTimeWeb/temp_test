import { describe, expect, it } from 'vitest';
import { sanitizeManagerLateFeesCsvCell } from '@/app/frontend_manager/manager_finance/finance_late_fees/utils/ManagerFinanceLateFeesCsv';

describe('ManagerFinanceLateFeesCsv', () => {
  it('neutralizes spreadsheet formula prefixes, including leading whitespace/control characters', () => {
    for (const value of ['=1+1', '+cmd', '-1+2', '@SUM(A1:A2)', '  =1+1', '\t=1+1', '\uFEFF=1+1']) {
      expect(sanitizeManagerLateFeesCsvCell(value)).toMatch(/^"'/);
    }
  });
  it('preserves ordinary values and correctly escapes CSV quotes', () => {
    expect(sanitizeManagerLateFeesCsvCell('Ada Lovelace')).toBe('"Ada Lovelace"');
    expect(sanitizeManagerLateFeesCsvCell('O"Brien, Jr')).toBe('"O""Brien, Jr"');
    expect(sanitizeManagerLateFeesCsvCell('')).toBe('""');
  });
});
