// state/useSuperadminDataBackupOperationsStore.ts
import { create } from 'zustand';
import type { SuperadminBackupSchedule } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/types/superadmin_data_backup_operations.types';

interface SuperadminDataBackupOperationsState {
  isCreateScheduleModalOpen: boolean;
  isFullBackupModalOpen: boolean;
  selectedScheduleForEdit: SuperadminBackupSchedule | null;
  searchFilter: string;
  openCreateScheduleModal: (schedule?: SuperadminBackupSchedule) => void;
  closeCreateScheduleModal: () => void;
  openFullBackupModal: () => void;
  closeFullBackupModal: () => void;
  setSearchFilter: (filter: string) => void;
  resetState: () => void;
}

export const useSuperadminDataBackupOperationsStore = create<SuperadminDataBackupOperationsState>((set) => ({
  isCreateScheduleModalOpen: false,
  isFullBackupModalOpen: false,
  selectedScheduleForEdit: null,
  searchFilter: '',
  openCreateScheduleModal: (schedule) =>
    set({ isCreateScheduleModalOpen: true, selectedScheduleForEdit: schedule ?? null }),
  closeCreateScheduleModal: () =>
    set({ isCreateScheduleModalOpen: false, selectedScheduleForEdit: null }),
  openFullBackupModal: () => set({ isFullBackupModalOpen: true }),
  closeFullBackupModal: () => set({ isFullBackupModalOpen: false }),
  setSearchFilter: (filter) => set({ searchFilter: filter }),
  resetState: () =>
    set({
      isCreateScheduleModalOpen: false,
      isFullBackupModalOpen: false,
      selectedScheduleForEdit: null,
      searchFilter: '',
    }),
}));
