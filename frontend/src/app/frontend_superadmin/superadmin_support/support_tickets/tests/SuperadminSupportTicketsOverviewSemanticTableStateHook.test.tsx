// RESPONSIBILITY: Define source-level test coverage for support tickets using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_support/support_tickets/tests/SuperadminSupportTicketsOverviewSemanticTableStateHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useSuperadminSupportTicketsOverviewSemanticTableState } from '@/app/frontend_superadmin/superadmin_support/support_tickets/hooks/useSuperadminSupportTicketsOverviewSemanticTableState';

type Row = { id: string; name: string; score: number };
const rows: Row[] = [{ id: 'b', name: 'Beta', score: 2 }, { id: 'a', name: 'Alpha', score: 1 }, { id: 'c', name: 'Gamma', score: 3 }];

describe('useSuperadminSupportTicketsOverviewSemanticTableState', () => {
  afterEach(() => { window.history.replaceState({}, '', '/'); });
  it('sorts mixed-unit ticket ages by elapsed duration', () => {
    const ticketRows = [
      { id: 'day', age: '1 day' },
      { id: 'hours', age: '4 hours' },
      { id: 'days', age: '3 days' },
    ];
    const { result } = renderHook(() => useSuperadminSupportTicketsOverviewSemanticTableState({ rowData: ticketRows, paginationPageSize: 10 }));
    act(() => result.current.setSort({ field: 'age', direction: 'asc' }));
    expect(result.current.sortedRows.map((row) => row.id)).toEqual(['hours', 'day', 'days']);
  });

  it('removes stale URL search state when the visible filter is disabled', () => {
    window.history.replaceState({}, '', '/?keep=1&sa_support_tickets_overview_search=hidden');
    const { result } = renderHook(() => useSuperadminSupportTicketsOverviewSemanticTableState({ rowData: rows, paginationPageSize: 10, filterEnabled: false }));
    expect(result.current.filterText).toBe('');
    expect(window.location.search).toContain('keep=1');
    expect(window.location.search).not.toContain('sa_support_tickets_overview_search');
  });

  it('keeps row order by default and exposes bounded pagination state', () => {
    const { result } = renderHook(() => useSuperadminSupportTicketsOverviewSemanticTableState({ rowData: rows, paginationPageSize: 2 }));
    expect(result.current.sortedRows).toHaveLength(3);
    expect(result.current.visibleRows).toHaveLength(2);
    expect(result.current.pageCount).toBe(2);
  });
  it('applies the module table filter/sort controls without mutating input rows', () => {
    const { result } = renderHook(() => useSuperadminSupportTicketsOverviewSemanticTableState({ rowData: rows, paginationPageSize: 2 }));
    act(() => result.current.setFilterText('alpha'));
    if ('setSort' in result.current) act(() => result.current.setSort({ field: 'name', direction: 'asc' }));
    expect(result.current.sortedRows.length).toBeGreaterThan(0);
    expect(rows.map((row) => row.name)).toEqual(['Beta', 'Alpha', 'Gamma']);
  });
});
