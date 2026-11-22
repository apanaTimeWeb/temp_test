// state/useSuperadminUsageOverviewStore.ts
// DATA FLOW: UI Controls -> useSuperadminUsageOverviewStore -> Filter State -> Query Hooks
import { create } from 'zustand';
import type { QuotaSeverity } from '../types/SuperadminUsageOverviewTypes';

interface SuperadminUsageOverviewState {
  search: string;
  planTier: string;
  severity: 'ALL' | QuotaSeverity;
  categoryTab: 'all' | 'branches' | 'storage' | 'communication' | 'system';
  selectedLibraryId: string | null;
  isDetailDrawerOpen: boolean;

  setSearch: (search: string) => void;
  setPlanTier: (planTier: string) => void;
  setSeverity: (severity: 'ALL' | QuotaSeverity) => void;
  setCategoryTab: (tab: 'all' | 'branches' | 'storage' | 'communication' | 'system') => void;
  openDetailDrawer: (libraryId: string) => void;
  closeDetailDrawer: () => void;
  resetFilters: () => void;
}

export const useSuperadminUsageOverviewStore = create<SuperadminUsageOverviewState>((set) => ({
  search: '',
  planTier: 'ALL',
  severity: 'ALL',
  categoryTab: 'all',
  selectedLibraryId: null,
  isDetailDrawerOpen: false,

  setSearch: (search) => set({ search }),
  setPlanTier: (planTier) => set({ planTier }),
  setSeverity: (severity) => set({ severity }),
  setCategoryTab: (categoryTab) => set({ categoryTab }),
  openDetailDrawer: (libraryId) => set({ selectedLibraryId: libraryId, isDetailDrawerOpen: true }),
  closeDetailDrawer: () => set({ selectedLibraryId: null, isDetailDrawerOpen: false }),
  resetFilters: () => set({ search: '', planTier: 'ALL', severity: 'ALL', categoryTab: 'all' }),
}));
