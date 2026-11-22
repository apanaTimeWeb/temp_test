// RESPONSIBILITY: Define source-level test coverage for analytics overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_overview/tests/SuperadminAnalyticsOverviewUrlFilterHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { buildSuperadminReportsFilterSearch, useSuperadminAnalyticsOverviewUrlFilter } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/hooks/useSuperadminAnalyticsOverviewUrlFilter';

describe('buildSuperadminReportsFilterSearch', () => {
  it('updates one filter while preserving unrelated query parameters', () => {
    const next = new URLSearchParams(buildSuperadminReportsFilterSearch('page=2&status=old&sort=name', 'status', 'all', 'active'));
    expect(next.get('page')).toBe('2');
    expect(next.get('sort')).toBe('name');
    expect(next.get('status')).toBe('active');
  });
  it('removes the filter when the fallback value is selected', () => {
    const next = new URLSearchParams(buildSuperadminReportsFilterSearch('page=2&status=active', 'status', 'all', 'all'));
    expect(next.has('status')).toBe(false);
    expect(next.get('page')).toBe('2');
  });
});

// Browser history is intentionally updated with pushState so successive filter selections are navigable.


describe('useSuperadminAnalyticsOverviewUrlFilter history behavior', () => {
  it('creates a history entry for a filter change so Back/Forward can restore it', () => {
    const pushSpy = vi.spyOn(window.history, 'pushState');
    const { result } = renderHook(() => useSuperadminAnalyticsOverviewUrlFilter('range', 'all', ['all', 'month'] as const));
    act(() => result.current[1]('month'));
    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy.mock.calls[0]?.[2]).toContain('range=month');
    pushSpy.mockRestore();
  });
});
