'use client';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ALL_BRANCHES_ID,
  DEFAULT_ADMIN_BRANCHES,
  type AdminBranchItem,
} from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';

export interface AdminBranchContextValue {
  branches: readonly AdminBranchItem[];
  selectedBranchId: string;
  selectedBranch: AdminBranchItem | null;
  setSelectedBranchId: (id: string) => void;
  isAllBranches: boolean;
}

const STORAGE_KEY = 'admin_selected_branch';

const DEFAULT_CONTEXT_VALUE: AdminBranchContextValue = {
  branches: DEFAULT_ADMIN_BRANCHES,
  selectedBranchId: ALL_BRANCHES_ID,
  selectedBranch: null,
  setSelectedBranchId: () => {},
  isAllBranches: true,
};

const AdminBranchContext = createContext<AdminBranchContextValue>(DEFAULT_CONTEXT_VALUE);

function resolveInitialBranch(): string {
  if (typeof window === 'undefined') return ALL_BRANCHES_ID;
  try {
    const urlParam = new URLSearchParams(window.location.search).get('branch');
    if (urlParam) {
      if (urlParam === ALL_BRANCHES_ID || DEFAULT_ADMIN_BRANCHES.some((b) => b.id === urlParam)) {
        return urlParam;
      }
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === ALL_BRANCHES_ID || DEFAULT_ADMIN_BRANCHES.some((b) => b.id === stored))) {
      return stored;
    }
  } catch {
    // Graceful fallback when storage/URL is inaccessible
  }
  return ALL_BRANCHES_ID;
}

export function AdminBranchProvider({
  children,
  initialBranches = DEFAULT_ADMIN_BRANCHES,
  defaultBranchId,
}: {
  children: ReactNode;
  initialBranches?: readonly AdminBranchItem[];
  defaultBranchId?: string;
}) {
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(() => defaultBranchId ?? resolveInitialBranch());

  const setSelectedBranchId = (branchId: string) => {
    setSelectedBranchIdState(branchId);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, branchId);
        const url = new URL(window.location.href);
        if (branchId === ALL_BRANCHES_ID) {
          url.searchParams.delete('branch');
        } else {
          url.searchParams.set('branch', branchId);
        }
        window.history.replaceState({}, '', url.toString());
      } catch {
        // Fallback for isolated test environments
      }
    }
  };

  const selectedBranch = useMemo(() => {
    if (selectedBranchId === ALL_BRANCHES_ID) return null;
    return initialBranches.find((b) => b.id === selectedBranchId) ?? null;
  }, [selectedBranchId, initialBranches]);

  const contextValue = useMemo<AdminBranchContextValue>(
    () => ({
      branches: initialBranches,
      selectedBranchId,
      selectedBranch,
      setSelectedBranchId,
      isAllBranches: selectedBranchId === ALL_BRANCHES_ID,
    }),
    [initialBranches, selectedBranchId, selectedBranch],
  );

  return <AdminBranchContext.Provider value={contextValue}>{children}</AdminBranchContext.Provider>;
}

export function useAdminBranch(): AdminBranchContextValue {
  return useContext(AdminBranchContext);
}

