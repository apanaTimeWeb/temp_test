// RESPONSIBILITY: Define source-level test coverage for accounting financial reports using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_financial_reports/tests/SuperadminAccountingFinancialReportsAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const COMPONENTS = new URL('../components/', import.meta.url);

describe('accounting_financial_reports async-state contract', () => {
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(new URL('SuperadminAccountingFinancialReportsListSkeleton.tsx', COMPONENTS), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(new URL('SuperadminAccountingFinancialReportsErrorFallback.tsx', COMPONENTS), 'utf8');
    const loading = readFileSync(new URL('../loading.tsx', import.meta.url), 'utf8');
    const error = readFileSync(new URL('../error.tsx', import.meta.url), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminAccountingFinancialReportsListSkeleton');
    expect(error).toContain('SuperadminAccountingFinancialReportsErrorFallback');
    expect(error).not.toContain('...props');
  });
  it('styles chart tooltips with light/dark semantic tokens rather than a fixed theme', () => {
    const source = readFileSync(new URL('SuperadminAccountingFinancialReportsPageClient.tsx', COMPONENTS), 'utf8');
    expect(source).toContain("cssClass: 'accounting-financial-reports-tooltip'");
    expect(source).toContain('var(--chart-tooltip-bg)');
    expect(source).toContain('var(--bg-popover)');
    expect(source).not.toContain("theme: 'light'");
  });
  it('keeps report presentation in leaf-owned components and resolves sample labels through locale keys', () => {
    const page = readFileSync(new URL('SuperadminAccountingFinancialReportsPageClient.tsx', COMPONENTS), 'utf8');
    const chart = readFileSync(new URL('SuperadminAccountingFinancialReportsIncomeExpenseChart.tsx', COMPONENTS), 'utf8');
    const breakdown = readFileSync(new URL('SuperadminAccountingFinancialReportsCategoryBreakdown.tsx', COMPONENTS), 'utf8');
    expect(page).toContain('SuperadminAccountingFinancialReportsKpiCards');
    expect(page).toContain('SuperadminAccountingFinancialReportsCategoryBreakdown');
    expect(chart).toContain('COPY.MONTH_OCT');
    expect(chart).not.toContain('categories: visibleMonths.map(entry => entry.month)');
    expect(breakdown).toContain('COPY.CATEGORY_ELECTRICITY');
    expect(breakdown).not.toContain('{category.category}</span>');
  });
});
