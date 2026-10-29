import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_finance/finance_payment_promises'),
  join(process.cwd(), 'app/frontend_manager/manager_finance/finance_payment_promises'),
  join(process.cwd(), 'frontend_manager/manager_finance/finance_payment_promises'),
  join(process.cwd(), '..', '..'),
  join(process.cwd(), '..'),
  process.cwd(),
];
const moduleRoot = moduleRootCandidates.find((candidate) =>
  existsSync(join(candidate, 'config/manager_finance_payment_promises.url_config.ts')) &&
  existsSync(join(candidate, 'components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesPage.tsx'))
);
if (!moduleRoot) throw new Error('Could not locate canonical manager_finance module root for finance_payment_promises.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('Finance sample-fixture ownership and disabled actions — finance_payment_promises', () => {
  it('keeps illustrative records in the module-owned fixture boundary', () => {
    const fixtureSource = readSource('mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesComponentSampleFixtures.ts');
    expect(fixtureSource).toMatch(/Component-level Finance preview records|static layout fixtures|SAMPLE_/i);
    const pageSource = readSource('components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesPage.tsx');
    expect(pageSource).toMatch(/MANAGER_FINANCE_SAMPLE_|SAMPLE_FIXTURES/);
    expect(pageSource).toMatch(/role="status"/);
    expect(pageSource).not.toMatch(/\{\s*id\s*:\s*['"][A-Z0-9-]+['"]/);
    const moduleImports = [...pageSource.matchAll(/from ['"]([^'"]+)['"]/g)].map((match) => match[1]);
    expect(moduleImports.some((path) => path.includes('/manager_finance/finance_payment_promises/') && (path.includes('/mocks/') || path.includes('/hooks/')))).toBe(true);
    expect(moduleImports.filter((path) => path.includes('/app/frontend_manager/manager_finance/')).every((path) => path.includes('/manager_finance/finance_payment_promises/'))).toBe(true);
  });

  it('does not present synthetic fixture records as authoritative API results', () => {
    const apiSource = readSource('api/manager_finance_payment_promises.api.ts');
    expect(apiSource).toContain('CONTRACT_NOT_FOUND_IN_WEB_ZIP');
    expect(apiSource).toMatch(/throw Object\.assign\(/);
    expect(apiSource).not.toMatch(/\b(?:apiFetch|fetch|axios)\s*\(/);
    expect(readSource('mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesComponentSampleFixtures.ts')).toMatch(/Component-level Finance preview records|static layout fixtures/i);
  });

  it('keeps refund workflows owned by their canonical finance route', () => {
    const pageSource = readSource('components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesPage.tsx');
    expect(pageSource).not.toMatch(/RefundRequestPanel|RefundProcessDialog|RefundDeductionDialog/);
    expect(existsSync(join(moduleRoot, 'components/finance_payment_promises_widgets/FinancePaymentPromisesRefundRequestPanel.tsx'))).toBe(false);
    expect(existsSync(join(moduleRoot, '..', 'finance_refunds/config/manager_finance_refunds.url_config.ts'))).toBe(true);
  });
});
