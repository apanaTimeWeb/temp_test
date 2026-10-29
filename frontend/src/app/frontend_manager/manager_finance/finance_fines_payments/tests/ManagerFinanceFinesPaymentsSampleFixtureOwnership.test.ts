import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_finance/finance_fines_payments'),
  join(process.cwd(), 'app/frontend_manager/manager_finance/finance_fines_payments'),
  join(process.cwd(), 'frontend_manager/manager_finance/finance_fines_payments'),
  join(process.cwd(), '..', '..'),
  join(process.cwd(), '..'),
  process.cwd(),
];
const moduleRoot = moduleRootCandidates.find((candidate) =>
  existsSync(join(candidate, 'config/manager_finance_fines_payments.url_config.ts')) &&
  existsSync(join(candidate, 'components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsFinesAndPaymentsPage.tsx'))
);
if (!moduleRoot) throw new Error('Could not locate the canonical manager_finance module for finance_fines_payments.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('Finance sample-fixture ownership and disabled actions — finance_fines_payments', () => {
  it('keeps illustrative records inside this module and out of inline page data', () => {
    const fixtureSource = readSource('mocks/manager_finance_fines_payments_fixtures/ManagerFinanceFinesPaymentsComponentSampleFixtures.ts');
    expect(fixtureSource).toMatch(/Component-level Finance preview records|static layout fixtures|SAMPLE_/i);
    const pageSource = readSource('components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsFinesAndPaymentsPage.tsx');
    expect(pageSource).toMatch(/MANAGER_FINANCE_SAMPLE_|SAMPLE_FIXTURES|DemoRepository/);
    expect(pageSource).toMatch(/role="status"|data-testid=/);
    expect(pageSource).not.toMatch(/\{\s*id\s*:\s*['"][A-Z0-9-]+['"]/);
    const moduleImports = [...pageSource.matchAll(/from ['"]([^'"]+)['"]/g)].map((match) => match[1]);
    expect(moduleImports.some((path) => path.includes('/manager_finance/finance_fines_payments/') && (path.includes('/mocks/') || path.includes('/hooks/')))).toBe(true);
    expect(moduleImports.filter((path) => path.includes('/app/frontend_manager/manager_finance/')).every((path) => path.includes('/manager_finance/finance_fines_payments/'))).toBe(true);
  });

  it('keeps unavailable backend operations fail-closed and does not issue direct network requests', () => {
    const apiSource = readSource('api/manager_finance_fines_payments.api.ts');
    expect(apiSource).toContain('CONTRACT_NOT_FOUND_IN_WEB_ZIP');
    expect(apiSource).toMatch(/throw Object\.assign\(/);
    expect(apiSource).not.toMatch(/\b(?:apiFetch|fetch|axios)\s*\(/);
    expect(readSource('mocks/manager_finance_fines_payments_fixtures/ManagerFinanceFinesPaymentsComponentSampleFixtures.ts')).toMatch(/Component-level Finance preview records|static layout fixtures/i);
  });

  it('routes refund requests to the canonical refunds owner without duplicate UI', () => {
    const pageSource = readSource('components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsFinesAndPaymentsPage.tsx');
    const routeSource = readSource('config/manager_finance_fines_payments.url_config.ts');
    expect(pageSource).toMatch(/tab\.id === 'refundRequests'[\s\S]*?router\.push\(MANAGER_FINANCE_FINES_PAYMENTS_ROUTES\.REFUNDS\)/);
    expect(pageSource).not.toContain('ManagerFinanceFinesPaymentsRefundRequestPanel');
    expect(routeSource).toContain("REFUNDS: '/frontend_manager/manager_finance/finance_refunds'");
    expect(existsSync(join(moduleRoot, 'components/manager_finance_fines_payments_widgets/ManagerFinanceFinesPaymentsRefundRequestPanel.tsx'))).toBe(false);
    expect(existsSync(join(moduleRoot, '..', 'finance_refunds/config/manager_finance_refunds.url_config.ts'))).toBe(true);
  });
});
