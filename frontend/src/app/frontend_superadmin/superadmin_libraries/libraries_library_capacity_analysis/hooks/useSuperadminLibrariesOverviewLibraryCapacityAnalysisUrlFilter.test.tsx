import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/hooks/useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter';

const allowed = ['all', 'vacant', 'maintenance'] as const;

afterEach(() => {
  window.history.replaceState({}, '', '/superadmin/superadmin_libraries/libraries_library_capacity_analysis?keep=1');
  vi.restoreAllMocks();
});

describe('useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter', () => {
  it('accepts an allowed initial value and rejects unknown query values', () => {
    window.history.replaceState({}, '', '?status=maintenance&keep=1');
    const { result, unmount } = renderHook(() => useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter('status', 'all', allowed));
    expect(result.current[0]).toBe('maintenance');
    unmount();

    window.history.replaceState({}, '', '?status=unknown&keep=1');
    const invalid = renderHook(() => useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter('status', 'all', allowed));
    expect(invalid.result.current[0]).toBe('all');
    invalid.unmount();
  });

  it('preserves unrelated query values and writes only an allowed value with replaceState', () => {
    window.history.replaceState({}, '', '?keep=1&status=all');
    const replace = vi.spyOn(window.history, 'replaceState');
    const { result } = renderHook(() => useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter('status', 'all', allowed));
    act(() => result.current[1]('vacant'));
    expect(result.current[0]).toBe('vacant');
    expect(new URLSearchParams(window.location.search).get('keep')).toBe('1');
    expect(new URLSearchParams(window.location.search).get('status')).toBe('vacant');
    expect(replace).toHaveBeenCalledTimes(1);

    act(() => result.current[1]('unknown' as typeof allowed[number]));
    expect(result.current[0]).toBe('all');
    expect(new URLSearchParams(window.location.search).has('status')).toBe(false);
  });

  it('synchronizes popstate and removes its listener when unmounted', () => {
    window.history.replaceState({}, '', '?status=vacant');
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const { result, unmount } = renderHook(() => useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter('status', 'all', allowed));
    expect(result.current[0]).toBe('vacant');

    window.history.replaceState({}, '', '?status=maintenance');
    act(() => window.dispatchEvent(new PopStateEvent('popstate')));
    expect(result.current[0]).toBe('maintenance');
    unmount();
    expect(add).toHaveBeenCalledWith('popstate', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('popstate', expect.any(Function));
  });
});
