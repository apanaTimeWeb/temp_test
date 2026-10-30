// DATA FLOW: settings_branches route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { create } from 'zustand';
import type { AdminBranchesDetailTab } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';

export interface AdminBranchesStoreState {
  /** Selected identity only; branch/API records remain owned by TanStack Query. */
  viewingBranchId: string | null;
  detailTab: AdminBranchesDetailTab;
  setViewingBranchId: (branchId: string | null) => void;
  setDetailTab: (tab: AdminBranchesDetailTab) => void;
  reset: () => void;
}

const initialState = {
  viewingBranchId: null,
  detailTab: 'overview' as AdminBranchesDetailTab,
};

/** @description Owns transient branch selection/navigation shared across branch subviews. It never stores API records. */
export const useAdminBranchesStore = create<AdminBranchesStoreState>((set) => ({
  ...initialState,
  setViewingBranchId: (viewingBranchId) => set({ viewingBranchId }),
  setDetailTab: (detailTab) => set({ detailTab }),
  reset: () => set(initialState),
}));
