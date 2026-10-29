import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_finance/finance_trust_scores'),
  join(process.cwd(), 'app/frontend_manager/manager_finance/finance_trust_scores'),
  join(process.cwd(), 'frontend_manager/manager_finance/finance_trust_scores'),
  join(process.cwd(), '..', '..'),
  join(process.cwd(), '..'),
  process.cwd(),
];
const moduleRoot = moduleRootCandidates.find((candidate) =>
  existsSync(join(candidate, 'config/manager_finance_trust_scores.url_config.ts')) &&
  existsSync(join(candidate, 'components/manager_finance_trust_scores_views/ManagerFinanceTrustScoresTrustScorePage.tsx'))
);
if (!moduleRoot) throw new Error('Could not locate canonical manager_finance module root for finance_trust_scores.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('Finance contract-dependent interaction closure — finance_trust_scores', () => {
  it('does not invent or call an external endpoint while the contract is missing', () => {
    const api = readSource('api/manager_finance_trust_scores.api.ts');
    expect(api).toContain("'CONTRACT_NOT_FOUND_IN_WEB_ZIP'");
    expect(api).toMatch(/throw Object\.assign\(/);
    expect(api).not.toMatch(/\b(?:apiFetch|fetch|axios)\s*\(/);
  });

  it('marks the canonical page as sample/contract limited and keeps mutations disabled', () => {
    const pageSource = readSource('components/manager_finance_trust_scores_views/ManagerFinanceTrustScoresTrustScorePage.tsx');
    expect(pageSource).toMatch(/role="status"/);
    expect(pageSource).toMatch(/sample|contract|unavailable/i);
    expect(pageSource).toMatch(/<button[\s\S]*?disabled/);
    expect(pageSource).not.toMatch(/onClick=\{\s*async\s*\(\)\s*=>\s*(?:apiFetch|fetch)\(/);
  });

  it('does not mount refund or fine-receipt workflows outside their canonical modules', () => {
    const pageSource = readSource('components/manager_finance_trust_scores_views/ManagerFinanceTrustScoresTrustScorePage.tsx');
    expect(pageSource).not.toMatch(/RefundRequestPanel|RefundProcessDialog|RefundDeductionDialog|FineReceiptPanel/);
    expect(existsSync(join(moduleRoot, '..', 'finance_refunds/config/manager_finance_refunds.url_config.ts'))).toBe(true);
    expect(existsSync(join(moduleRoot, '..', 'finance_fines_payments/config/manager_finance_fines_payments.url_config.ts'))).toBe(true);
  });
});
