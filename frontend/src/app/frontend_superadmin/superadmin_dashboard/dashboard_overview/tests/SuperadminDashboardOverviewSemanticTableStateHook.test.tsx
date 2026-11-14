// RESPONSIBILITY: Define source-level test coverage for dashboard overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_dashboard/dashboard_overview/tests/SuperadminDashboardOverviewSemanticTableStateHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useSuperadminDashboardOverviewSemanticTableState } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/hooks/useSuperadminDashboardOverviewSemanticTableState';
const navigationState = vi.hoisted(() => ({ query: 'tenant=sample', replace: vi.fn() }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/superadmin/superadmin_dashboard/dashboard_overview',
  useRouter: () => ({ replace: navigationState.replace }),
  useSearchParams: () => new URLSearchParams(navigationState.query),
}));

type Row = { id: string; name: string; score: number };
const rows: Row[] = [{ id: 'b', name: 'Beta', score: 2 }, { id: 'a', name: 'Alpha', score: 1 }, { id: 'c', name: 'Gamma', score: 3 }];

describe('useSuperadminDashboardOverviewSemanticTableState', () => {
  beforeEach(() => { navigationState.query = 'tenant=sample'; navigationState.replace.mockClear(); });
  afterEach(() => { vi.useRealTimers(); });
  it('keeps row order by default and exposes bounded pagination state', () => {
    const { result } = renderHook(() => useSuperadminDashboardOverviewSemanticTableState({ rowData: rows, paginationPageSize: 2 }));
    expect(result.current.sortedRows).toHaveLength(3);
    expect(result.current.visibleRows).toHaveLength(2);
    expect(result.current.pageCount).toBe(2);
  });
  it('applies the module table filter/sort controls without mutating input rows', () => {
    const { result } = renderHook(() => useSuperadminDashboardOverviewSemanticTableState({ rowData: rows, paginationPageSize: 2 }));
    act(() => result.current.setFilterText('alpha'));
    if ('setSort' in result.current) act(() => result.current.setSort({ field: 'name', direction: 'asc' }));
    expect(result.current.sortedRows.length).toBeGreaterThan(0);
    expect(rows.map((row) => row.name)).toEqual(['Beta', 'Alpha', 'Gamma']);
  });
  it('uses Next router replacement, preserves unrelated query parameters, and debounces free-text search by 300ms', () => {
    vi.useFakeTimers();
    const manyRows = Array.from({ length: 8 }, (_, index) => ({ id: String(index), name: `Row ${index}`, score: index }));
    const { result } = renderHook(() => useSuperadminDashboardOverviewSemanticTableState({ rowData: manyRows, paginationPageSize: 2 }));
    act(() => result.current.setFilterText('synthetic-search'));
    act(() => { vi.advanceTimersByTime(299); });
    expect(navigationState.replace).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1); });
    expect(navigationState.replace).toHaveBeenCalledWith(
      expect.stringContaining('tenant=sample'),
      { scroll: false },
    );
    expect(navigationState.replace.mock.calls.at(-1)?.[0]).toContain('sa_dashboard_overview_search=synthetic-search');
  });

  it('rehydrates search and page state when the App Router search parameters change', () => {
    const { result, rerender } = renderHook(() => useSuperadminDashboardOverviewSemanticTableState({ rowData: rows, paginationPageSize: 1 }));
    navigationState.query = 'tenant=kept&sa_dashboard_overview_search=restored&sa_dashboard_overview_page=2';
    rerender();
    expect(result.current.filterText).toBe('restored');
    expect(result.current.page).toBe(2);
  });

});
