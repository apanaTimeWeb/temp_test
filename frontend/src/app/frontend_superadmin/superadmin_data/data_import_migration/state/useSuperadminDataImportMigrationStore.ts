// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/state/useSuperadminDataImportMigrationStore.ts
/**
 * @file useSuperadminDataImportMigrationStore.ts
 * @description Module-scoped Zustand store for Data Import & Migration Management.
 */

import { create } from 'zustand';
import type { PreflightValidationResult } from '@/app/frontend_superadmin/superadmin_data/data_import_migration/types/superadmin_data_import_migration.types';

interface ImportMigrationState {
  activePreflightResult: PreflightValidationResult | null;
  filterStatus: string;
  filterTenant: string;

  // Actions
  setActivePreflightResult: (result: PreflightValidationResult | null) => void;
  setFilterStatus: (status: string) => void;
  setFilterTenant: (tenant: string) => void;
  clearPreflight: () => void;
  resetFilters: () => void;
}

export const useSuperadminDataImportMigrationStore = create<ImportMigrationState>((set) => ({
  activePreflightResult: null,
  filterStatus: 'ALL',
  filterTenant: 'ALL',

  setActivePreflightResult: (result) => set({ activePreflightResult: result }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterTenant: (tenant) => set({ filterTenant: tenant }),
  clearPreflight: () => set({ activePreflightResult: null }),
  resetFilters: () => set({ filterStatus: 'ALL', filterTenant: 'ALL' }),
}));
