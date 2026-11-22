// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/state/useSuperadminDataRestoreOperationsStore.ts
/**
 * @file useSuperadminDataRestoreOperationsStore.ts
 * @description Module-scoped Zustand store for Restore Operations screen interaction.
 */

import { create } from 'zustand';
import type { BackupSnapshotRecord } from '../types/superadmin_data_restore_operations.types';

interface RestoreOperationsState {
  selectedSnapshot: BackupSnapshotRecord | null;
  scopeFilter: string;
  searchQuery: string;
  isRestoreModalOpen: boolean;
  isDrillModalOpen: boolean;
  activeRestoreJobId: string | null;

  // Actions
  setSelectedSnapshot: (snapshot: BackupSnapshotRecord | null) => void;
  setScopeFilter: (scope: string) => void;
  setSearchQuery: (query: string) => void;
  openRestoreModal: (snapshot: BackupSnapshotRecord) => void;
  closeRestoreModal: () => void;
  openDrillModal: (snapshot: BackupSnapshotRecord) => void;
  closeDrillModal: () => void;
  setActiveRestoreJobId: (jobId: string | null) => void;
  resetFilters: () => void;
}

export const useSuperadminDataRestoreOperationsStore = create<RestoreOperationsState>((set) => ({
  selectedSnapshot: null,
  scopeFilter: 'ALL',
  searchQuery: '',
  isRestoreModalOpen: false,
  isDrillModalOpen: false,
  activeRestoreJobId: null,

  setSelectedSnapshot: (snapshot) => set({ selectedSnapshot: snapshot }),
  setScopeFilter: (scope) => set({ scopeFilter: scope }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  openRestoreModal: (snapshot) =>
    set({ selectedSnapshot: snapshot, isRestoreModalOpen: true }),
  closeRestoreModal: () =>
    set({ isRestoreModalOpen: false }),
  openDrillModal: (snapshot) =>
    set({ selectedSnapshot: snapshot, isDrillModalOpen: true }),
  closeDrillModal: () =>
    set({ isDrillModalOpen: false }),
  setActiveRestoreJobId: (jobId) => set({ activeRestoreJobId: jobId }),
  resetFilters: () => set({ scopeFilter: 'ALL', searchQuery: '' }),
}));
