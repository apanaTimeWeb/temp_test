import { describe, expect, it } from 'vitest';
import { sanitizeManagerTrustScoresCsvCell } from '@/app/frontend_manager/manager_finance/finance_trust_scores/utils/ManagerFinanceTrustScoresCsv';

describe('ManagerFinanceTrustScoresCsv', () => {
  it('neutralizes spreadsheet formula prefixes, including leading whitespace/control characters', () => {
    for (const value of ['=1+1', '+cmd', '-1+2', '@SUM(A1:A2)', '  =1+1', '\t=1+1', '\uFEFF=1+1']) {
      expect(sanitizeManagerTrustScoresCsvCell(value)).toMatch(/^"'/);
    }
  });
  it('preserves ordinary values and correctly escapes CSV quotes', () => {
    expect(sanitizeManagerTrustScoresCsvCell('Ada Lovelace')).toBe('"Ada Lovelace"');
    expect(sanitizeManagerTrustScoresCsvCell('O"Brien, Jr')).toBe('"O""Brien, Jr"');
    expect(sanitizeManagerTrustScoresCsvCell('')).toBe('""');
  });
});
