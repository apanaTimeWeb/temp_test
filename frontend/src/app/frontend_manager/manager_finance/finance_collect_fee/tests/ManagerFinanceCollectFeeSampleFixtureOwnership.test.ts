import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_finance/finance_collect_fee'),
  join(process.cwd(), 'app/frontend_manager/manager_finance/finance_collect_fee'),
  join(process.cwd(), 'frontend_manager/manager_finance/finance_collect_fee'),
  join(process.cwd(), '..', '..'),
  join(process.cwd(), '..'),
  process.cwd(),
];
const moduleRoot = moduleRootCandidates.find((candidate) =>
  existsSync(join(candidate, 'config/manager_finance_collect_fee.url_config.ts')) &&
  existsSync(join(candidate, 'components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePage.tsx'))
);
if (!moduleRoot) throw new Error('Could not locate the canonical manager_finance module for finance_collect_fee.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('Finance sample-fixture ownership and disabled actions — finance_collect_fee', () => {
  it('keeps illustrative records inside this module and out of inline page data', () => {
    const fixtureSource = readSource('mocks/manager_finance_collect_fee_fixtures/ManagerFinanceCollectFeeComponentSampleFixtures.ts');
    expect(fixtureSource).toMatch(/Component-level Finance preview records|static layout fixtures|SAMPLE_/i);
    const pageSource = readSource('components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePage.tsx');
    expect(pageSource).toMatch(/MANAGER_FINANCE_SAMPLE_|MANAGER_FINANCE_COLLECT_FEE_STUDENTS|SAMPLE_FIXTURES|DemoRepository/);
    expect(pageSource).toMatch(/role="status"|data-testid=/);
    expect(pageSource).not.toMatch(/\{\s*id\s*:\s*['"][A-Z0-9-]+['"]/);
    const moduleImports = [...pageSource.matchAll(/from ['"]([^'"]+)['"]/g)].map((match) => match[1]);
    expect(moduleImports.some((path) => path.includes('/manager_finance/finance_collect_fee/') && (path.includes('/mocks/') || path.includes('/hooks/')))).toBe(true);
    expect(moduleImports.filter((path) => path.includes('/app/frontend_manager/manager_finance/')).every((path) => path.includes('/manager_finance/finance_collect_fee/'))).toBe(true);
  });

  it('keeps unavailable backend operations fail-closed and does not issue direct network requests', () => {
    const apiSource = readSource('api/manager_finance_collect_fee.api.ts');
    expect(apiSource).toContain('CONTRACT_NOT_FOUND_IN_WEB_ZIP');
    expect(apiSource).toMatch(/throw Object\.assign\(/);
    expect(apiSource).not.toMatch(/\b(?:apiFetch|fetch|axios)\s*\(/);
    expect(readSource('mocks/manager_finance_collect_fee_fixtures/ManagerFinanceCollectFeeComponentSampleFixtures.ts')).toMatch(/Component-level Finance preview records|static layout fixtures/i);
  });

  it('keeps refund processing owned by the dedicated finance_refunds route', () => {
    const collectPage = readSource('components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePage.tsx');
    const routeConfig = readSource('config/manager_finance_collect_fee.url_config.ts');
    expect(collectPage).not.toContain('ManagerFinanceCollectFeeRefundRequestPanel');
    expect(collectPage).not.toContain('ManagerFinanceCollectFeeRefundProcessDialog');
    expect(routeConfig).toContain('MANAGER_FINANCE_COLLECT_FEE_ROUTES');
    expect(existsSync(join(frontendManagerRoot, 'manager_finance/finance_refunds/config/manager_finance_refunds.url_config.ts'))).toBe(true);
  });
});
