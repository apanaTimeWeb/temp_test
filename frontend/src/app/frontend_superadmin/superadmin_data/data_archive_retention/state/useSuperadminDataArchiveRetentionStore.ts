// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/state/useSuperadminDataArchiveRetentionStore.ts
/**
 * @file useSuperadminDataArchiveRetentionStore.ts
 * @description Module-scoped Zustand store for Data Archive & Retention Management.
 */

import { create } from 'zustand';
import type { RetentionRuleRecord } from '../types/superadmin_data_archive_retention.types';

interface ArchiveRetentionState {
  selectedRule: RetentionRuleRecord | null;
  isRuleModalOpen: boolean;
  filterEntityType: string;
  filterTier: string;

  // Actions
  openRuleModal: (rule: RetentionRuleRecord) => void;
  closeRuleModal: () => void;
  setFilterEntityType: (type: string) => void;
  setFilterTier: (tier: string) => void;
  resetFilters: () => void;
}

export const useSuperadminDataArchiveRetentionStore = create<ArchiveRetentionState>((set) => ({
  selectedRule: null,
  isRuleModalOpen: false,
  filterEntityType: 'ALL',
  filterTier: 'ALL',

  openRuleModal: (rule) => set({ selectedRule: rule, isRuleModalOpen: true }),
  closeRuleModal: () => set({ selectedRule: null, isRuleModalOpen: false }),
  setFilterEntityType: (type) => set({ filterEntityType: type }),
  setFilterTier: (tier) => set({ filterTier: tier }),
  resetFilters: () => set({ filterEntityType: 'ALL', filterTier: 'ALL' }),
}));
