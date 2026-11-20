// state/useSuperadminDataOverviewStore.ts
// DATA FLOW: UI Action -> useSuperadminDataOverviewStore -> Modal / Filter toggles
import { create } from 'zustand';

interface SuperadminDataOverviewState {
  isQuickBackupModalOpen: boolean;
  isSimulatingDrill: boolean;
  activityFilter: 'ALL' | 'BACKUP' | 'RESTORE' | 'EXPORT' | 'IMPORT';
  selectedCategory: string | null;
  openQuickBackupModal: () => void;
  closeQuickBackupModal: () => void;
  setActivityFilter: (filter: 'ALL' | 'BACKUP' | 'RESTORE' | 'EXPORT' | 'IMPORT') => void;
  setSelectedCategory: (category: string | null) => void;
  setIsSimulatingDrill: (running: boolean) => void;
  resetState: () => void;
}

export const useSuperadminDataOverviewStore = create<SuperadminDataOverviewState>((set) => ({
  isQuickBackupModalOpen: false,
  isSimulatingDrill: false,
  activityFilter: 'ALL',
  selectedCategory: null,
  openQuickBackupModal: () => set({ isQuickBackupModalOpen: true }),
  closeQuickBackupModal: () => set({ isQuickBackupModalOpen: false }),
  setActivityFilter: (filter) => set({ activityFilter: filter }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setIsSimulatingDrill: (running) => set({ isSimulatingDrill: running }),
  resetState: () =>
    set({
      isQuickBackupModalOpen: false,
      isSimulatingDrill: false,
      activityFilter: 'ALL',
      selectedCategory: null,
    }),
}));
