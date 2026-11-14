// RESPONSIBILITY: Define source-level test coverage for subscriptions overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_overview/tests/SuperadminSubscriptionsOverviewSemanticTableStateHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSuperadminSubscriptionsOverviewSemanticTableState } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/hooks/useSuperadminSubscriptionsOverviewSemanticTableState';

type Row = { id: string; name: string; score: number };
const rows: Row[] = [{ id: 'b', name: 'Beta', score: 2 }, { id: 'a', name: 'Alpha', score: 1 }, { id: 'c', name: 'Gamma', score: 3 }];

describe('useSuperadminSubscriptionsOverviewSemanticTableState', () => {
  it('keeps row order by default and exposes bounded pagination state', () => {
    const { result } = renderHook(() => useSuperadminSubscriptionsOverviewSemanticTableState({ rowData: rows, paginationPageSize: 2 }));
    expect(result.current.sortedRows).toHaveLength(3);
    expect(result.current.visibleRows).toHaveLength(2);
    expect(result.current.pageCount).toBe(2);
  });
  it('applies the module table filter/sort controls without mutating input rows', () => {
    const { result } = renderHook(() => useSuperadminSubscriptionsOverviewSemanticTableState({ rowData: rows, paginationPageSize: 2 }));
    act(() => result.current.setFilterText('alpha'));
    if ('setSort' in result.current) act(() => result.current.setSort({ field: 'name', direction: 'asc' }));
    expect(result.current.sortedRows.length).toBeGreaterThan(0);
    expect(rows.map((row) => row.name)).toEqual(['Beta', 'Alpha', 'Gamma']);
  });
});
