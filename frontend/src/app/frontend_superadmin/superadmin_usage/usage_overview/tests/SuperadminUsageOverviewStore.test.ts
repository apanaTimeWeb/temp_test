import { describe, it, expect, beforeEach } from 'vitest';
import { useSuperadminUsageOverviewStore } from '../state/useSuperadminUsageOverviewStore';

describe('useSuperadminUsageOverviewStore', () => {
  beforeEach(() => {
    useSuperadminUsageOverviewStore.getState().resetFilters();
    useSuperadminUsageOverviewStore.getState().closeDetailDrawer();
  });

  it('initializes with default filter states', () => {
    const state = useSuperadminUsageOverviewStore.getState();
    expect(state.search).toBe('');
    expect(state.planTier).toBe('ALL');
    expect(state.severity).toBe('ALL');
    expect(state.categoryTab).toBe('all');
    expect(state.selectedLibraryId).toBeNull();
    expect(state.isDetailDrawerOpen).toBe(false);
  });

  it('updates search, planTier, severity, and categoryTab', () => {
    const store = useSuperadminUsageOverviewStore.getState();
    store.setSearch('Nalanda');
    store.setPlanTier('Enterprise (Tier 1)');
    store.setSeverity('EXCEEDED_100');
    store.setCategoryTab('branches');

    const updated = useSuperadminUsageOverviewStore.getState();
    expect(updated.search).toBe('Nalanda');
    expect(updated.planTier).toBe('Enterprise (Tier 1)');
    expect(updated.severity).toBe('EXCEEDED_100');
    expect(updated.categoryTab).toBe('branches');
  });

  it('manages detail drawer open and close state with library ID', () => {
    const store = useSuperadminUsageOverviewStore.getState();
    store.openDetailDrawer('lib-3');
    expect(useSuperadminUsageOverviewStore.getState().selectedLibraryId).toBe('lib-3');
    expect(useSuperadminUsageOverviewStore.getState().isDetailDrawerOpen).toBe(true);

    store.closeDetailDrawer();
    expect(useSuperadminUsageOverviewStore.getState().selectedLibraryId).toBeNull();
    expect(useSuperadminUsageOverviewStore.getState().isDetailDrawerOpen).toBe(false);
  });

  it('resets filters correctly', () => {
    const store = useSuperadminUsageOverviewStore.getState();
    store.setSearch('Query');
    store.setPlanTier('Pro');
    store.resetFilters();

    const resetState = useSuperadminUsageOverviewStore.getState();
    expect(resetState.search).toBe('');
    expect(resetState.planTier).toBe('ALL');
  });
});
