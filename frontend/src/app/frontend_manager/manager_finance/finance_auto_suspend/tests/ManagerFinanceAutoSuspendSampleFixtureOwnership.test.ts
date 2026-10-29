import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_finance/finance_auto_suspend'),
  join(process.cwd(), 'app/frontend_manager/manager_finance/finance_auto_suspend'),
  join(process.cwd(), 'frontend_manager/manager_finance/finance_auto_suspend'),
  join(process.cwd(), '..', '..'),
  join(process.cwd(), '..'),
  process.cwd(),
];
const moduleRoot = moduleRootCandidates.find((candidate) =>
  existsSync(join(candidate, 'config/manager_finance_auto_suspend.url_config.ts')) &&
  existsSync(join(candidate, 'components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendPage.tsx'))
);
if (!moduleRoot) throw new Error('Could not locate the canonical manager_finance module for finance_auto_suspend.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('Finance sample-fixture ownership and disabled actions — finance_auto_suspend', () => {
  it('keeps illustrative records inside this module and out of inline page data', () => {
    const fixtureSource = readSource('mocks/manager_finance_auto_suspend_fixtures/ManagerFinanceAutoSuspendComponentSampleFixtures.ts');
    expect(fixtureSource).toMatch(/Component-level Finance preview records|static layout fixtures|SAMPLE_/i);
    const pageSource = readSource('components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendPage.tsx');
    expect(pageSource).toMatch(/MANAGER_FINANCE_SAMPLE_|SAMPLE_FIXTURES|DemoRepository/);
    expect(pageSource).toMatch(/role="status"|data-testid=/);
    expect(pageSource).not.toMatch(/\{\s*id\s*:\s*['"][A-Z0-9-]+['"]/);
    const moduleImports = [...pageSource.matchAll(/from ['"]([^'"]+)['"]/g)].map((match) => match[1]);
    expect(moduleImports.some((path) => path.includes('/manager_finance/finance_auto_suspend/') && (path.includes('/mocks/') || path.includes('/hooks/')))).toBe(true);
    expect(moduleImports.filter((path) => path.includes('/app/frontend_manager/manager_finance/')).every((path) => path.includes('/manager_finance/finance_auto_suspend/'))).toBe(true);
  });

  it('keeps unavailable backend operations fail-closed and does not issue direct network requests', () => {
    const apiSource = readSource('api/manager_finance_auto_suspend.api.ts');
    expect(apiSource).toContain('CONTRACT_NOT_FOUND_IN_WEB_ZIP');
    expect(apiSource).toMatch(/throw Object\.assign\(/);
    expect(apiSource).not.toMatch(/\b(?:apiFetch|fetch|axios)\s*\(/);
    expect(readSource('mocks/manager_finance_auto_suspend_fixtures/ManagerFinanceAutoSuspendComponentSampleFixtures.ts')).toMatch(/Component-level Finance preview records|static layout fixtures/i);
  });

  it('keeps refund workflows owned by their canonical finance route', () => {
    const pageSource = readSource('components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendPage.tsx');
    expect(pageSource).not.toMatch(/RefundRequestPanel|RefundProcessDialog|RefundDeductionDialog/);
    expect(existsSync(join(moduleRoot, 'components/finance_auto_suspend_widgets/FinanceAutoSuspendRefundRequestPanel.tsx'))).toBe(false);
    expect(existsSync(join(moduleRoot, '..', 'finance_refunds/config/manager_finance_refunds.url_config.ts'))).toBe(true);
  });
});
