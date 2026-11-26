'use client';
import {
ALL_BRANCHES_ID,
DEFAULT_ADMIN_BRANCHES,
type AdminBranchItem,
} from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';
import { readBrowserStorageItem,writeBrowserStorageItem } from '@/lib/browserStorage';
import { createContext,useContext,useEffect,useMemo,useState,type ReactNode } from 'react';

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
    const storedResult = readBrowserStorageItem(STORAGE_KEY);
    if (storedResult.available && storedResult.value && (storedResult.value === ALL_BRANCHES_ID || DEFAULT_ADMIN_BRANCHES.some((b) => b.id === storedResult.value))) {
      return storedResult.value;
    }
    const cookieMatch = document.cookie.match(new RegExp('(^| )' + STORAGE_KEY + '=([^;]+)'));
    if (cookieMatch && cookieMatch[2]) {
      const cookieVal = decodeURIComponent(cookieMatch[2]);
      if (cookieVal === ALL_BRANCHES_ID || DEFAULT_ADMIN_BRANCHES.some((b) => b.id === cookieVal)) {
        return cookieVal;
      }
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
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(() => defaultBranchId ?? ALL_BRANCHES_ID);

  useEffect(() => {
    if (!defaultBranchId) {
      const initial = resolveInitialBranch();
      if (initial && initial !== ALL_BRANCHES_ID) {
        setSelectedBranchIdState(initial);
      }
    }
  }, [defaultBranchId]);

  const setSelectedBranchId = (branchId: string) => {
    setSelectedBranchIdState(branchId);
    if (typeof window !== 'undefined') {
      try {
        try {
          writeBrowserStorageItem(STORAGE_KEY, branchId);
        } catch {
          // Storage disabled in restricted/incognito contexts; cookie/URL sync still applies
        }
        document.cookie = `${STORAGE_KEY}=${encodeURIComponent(branchId)}; path=/; max-age=31536000; SameSite=Lax`;
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

