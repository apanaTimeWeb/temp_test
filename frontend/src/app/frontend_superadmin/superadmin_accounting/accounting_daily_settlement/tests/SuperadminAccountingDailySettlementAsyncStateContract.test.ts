// RESPONSIBILITY: Define source-level test coverage for accounting daily settlement using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_daily_settlement/tests/SuperadminAccountingDailySettlementAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const components = resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/components');

describe('superadmin_accounting/accounting_daily_settlement async-state source contract', () => {
  it('uses an accessible, reduced-motion-safe skeleton with source-matched columns', () => {
    const source = readFileSync(resolve(components, 'SuperadminAccountingDailySettlementListSkeleton.tsx'), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('grid grid-flow-col auto-cols-fr');
    expect(source.match(/'column-\d+'/g)?.length).toBe(9);
  });
  it('provides a retry action and avoids raw exception rendering', () => {
    const source = readFileSync(resolve(components, 'SuperadminAccountingDailySettlementErrorFallback.tsx'), 'utf8');
    expect(source).toContain('role="alert"');
    expect(source).toContain('onClick={onRetry}');
    expect(source).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(source).not.toContain('responseMessage');
    expect(source).not.toContain('error.message');
    expect(source).not.toContain('error.stack');
  });
  it('honors row/header dimensions and the default column sort/filter contract', () => {
    const source = readFileSync(resolve(components, 'SuperadminAccountingDailySettlementSemanticTable.tsx'), 'utf8');
    expect(source).toContain('style={{ height: headerHeight }}');
    expect(source).toContain('style={{ height: rowHeight }}');
    expect(source).toContain('defaultColDef?.sortable');
    expect(source).toContain('defaultColDef?.filter');
    expect(source).toContain("from '@/lib/display_value'");
  });
});
