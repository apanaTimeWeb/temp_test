// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/state/useSuperadminDataExportManagementStore.ts
/**
 * @file useSuperadminDataExportManagementStore.ts
 * @description Module-scoped Zustand store for Data Export Management.
 */

import { create } from 'zustand';
import type { ExportScope } from '@/app/frontend_superadmin/superadmin_data/data_export_management/types/superadmin_data_export_management.types';

interface ExportManagementState {
  isExportModalOpen: boolean;
  preselectedScope: ExportScope;
  preselectedTenantId: string | null;
  preselectedBranchId: string | null;
  filterScope: string;
  filterStatus: string;

  // Actions
  openExportModal: (scope?: ExportScope, tenantId?: string | null, branchId?: string | null) => void;
  closeExportModal: () => void;
  setFilterScope: (scope: string) => void;
  setFilterStatus: (status: string) => void;
  resetFilters: () => void;
}

export const useSuperadminDataExportManagementStore = create<ExportManagementState>((set) => ({
  isExportModalOpen: false,
  preselectedScope: 'TENANT',
  preselectedTenantId: null,
  preselectedBranchId: null,
  filterScope: 'ALL',
  filterStatus: 'ALL',

  openExportModal: (scope = 'TENANT', tenantId = null, branchId = null) =>
    set({
      isExportModalOpen: true,
      preselectedScope: scope,
      preselectedTenantId: tenantId,
      preselectedBranchId: branchId,
    }),
  closeExportModal: () =>
    set({
      isExportModalOpen: false,
      preselectedTenantId: null,
      preselectedBranchId: null,
    }),
  setFilterScope: (scope) => set({ filterScope: scope }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  resetFilters: () => set({ filterScope: 'ALL', filterStatus: 'ALL' }),
}));
