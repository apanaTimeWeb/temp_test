// hooks/useAdminAssetsRegisterState.ts
'use client';
import { useState, useMemo, useCallback } from 'react';
import type {
  AdminAssetRecord,
  AdminAssetCategory,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import { ADMIN_ASSET_REGISTER_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/assets_register/mocks/fixtures/admin_assets_register.fixtures';
import { isExpiringSoon } from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';

export type AssetTabFilter = 'ALL' | 'WARRANTY_ALERT' | 'ACTIVE_AMC' | 'NEEDS_SERVICE';

export function useAdminAssetsRegisterState(initialRecords: AdminAssetRecord[] = ADMIN_ASSET_REGISTER_FIXTURES) {
  const [records, setRecords] = useState<AdminAssetRecord[]>(initialRecords);
  const [tabFilter, setTabFilter] = useState<AssetTabFilter>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeAmcAsset, setActiveAmcAsset] = useState<AdminAssetRecord | null>(null);

  const availableBranches = useMemo(() => {
    const map = new Map<string, string>();
    records.forEach((r) => map.set(r.branchId, r.branchName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Tab filter
      if (tabFilter === 'WARRANTY_ALERT' && !isExpiringSoon(r.warrantyExpiryDate)) return false;
      if (tabFilter === 'ACTIVE_AMC' && r.amcStatus !== 'ACTIVE_AMC') return false;
      if (tabFilter === 'NEEDS_SERVICE' && r.status !== 'MAINTENANCE_REQUIRED' && r.status !== 'UNDER_REPAIR') return false;

      // Branch filter
      if (branchFilter !== 'ALL' && r.branchId !== branchFilter) return false;

      // Category filter
      if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesCode = r.assetCode.toLowerCase().includes(query);
        const matchesVendor = r.vendorName.toLowerCase().includes(query);
        const matchesSerial = r.serialNumber?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesCode && !matchesVendor && !matchesSerial) return false;
      }

      return true;
    });
  }, [records, tabFilter, branchFilter, categoryFilter, searchQuery]);

  const addRecord = useCallback((newRecord: AdminAssetRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<AdminAssetRecord>) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  return {
    records,
    setRecords,
    filteredRecords,
    tabFilter,
    setTabFilter,
    branchFilter,
    setBranchFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    availableBranches,
    isAddModalOpen,
    setIsAddModalOpen,
    activeAmcAsset,
    setActiveAmcAsset,
    addRecord,
    updateRecord,
  };
}

