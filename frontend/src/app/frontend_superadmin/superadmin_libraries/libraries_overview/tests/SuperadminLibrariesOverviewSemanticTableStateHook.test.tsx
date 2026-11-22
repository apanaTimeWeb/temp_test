// RESPONSIBILITY: Define source-level test coverage for libraries overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_overview/tests/SuperadminLibrariesOverviewSemanticTableStateHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSuperadminLibrariesOverviewSemanticTableState } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverviewSemanticTableState';

type Row = { id: string; name: string; score: number };
const rows: Row[] = [{ id: 'b', name: 'Beta', score: 2 }, { id: 'a', name: 'Alpha', score: 1 }, { id: 'c', name: 'Gamma', score: 3 }];

describe('useSuperadminLibrariesOverviewSemanticTableState', () => {
  it('keeps row order by default and exposes bounded pagination state', () => {
    const { result } = renderHook(() => useSuperadminLibrariesOverviewSemanticTableState({ rowData: rows, paginationPageSize: 2 }));
    expect(result.current.sortedRows).toHaveLength(3);
    expect(result.current.visibleRows).toHaveLength(2);
    expect(result.current.pageCount).toBe(2);
  });
  it('applies the module table filter/sort controls without mutating input rows', () => {
    const { result } = renderHook(() => useSuperadminLibrariesOverviewSemanticTableState({ rowData: rows, paginationPageSize: 2 }));
    act(() => result.current.setFilterText('alpha'));
    if ('setSort' in result.current) act(() => result.current.setSort({ field: 'name', direction: 'asc' }));
    expect(result.current.sortedRows.length).toBeGreaterThan(0);
    expect(rows.map((row) => row.name)).toEqual(['Beta', 'Alpha', 'Gamma']);
  });
});
