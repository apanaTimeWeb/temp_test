// hooks/useAdminAccountsDailySettlementState.ts
'use client';
import { useState, useMemo, useCallback } from 'react';
import type {
  DailySettlementRecord,
  SettlementStatus,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { ADMIN_DAILY_SETTLEMENT_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/mocks/fixtures/admin_accounts_daily_settlement.fixtures';

export type TabFilter = 'ALL' | SettlementStatus;

export function useAdminAccountsDailySettlementState(initialRecords: DailySettlementRecord[] = ADMIN_DAILY_SETTLEMENT_FIXTURES) {
  const [records, setRecords] = useState<DailySettlementRecord[]>(initialRecords);
  const [tabFilter, setTabFilter] = useState<TabFilter>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [approvingRecord, setApprovingRecord] = useState<DailySettlementRecord | null>(null);
  const [flaggingRecord, setFlaggingRecord] = useState<DailySettlementRecord | null>(null);

  const availableBranches = useMemo(() => {
    const branchMap = new Map<string, string>();
    records.forEach((r) => branchMap.set(r.branchId, r.branchName));
    return Array.from(branchMap.entries()).map(([id, name]) => ({ id, name }));
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Tab filter
      if (tabFilter !== 'ALL' && r.status !== tabFilter) return false;
      // Branch filter
      if (branchFilter !== 'ALL' && r.branchId !== branchFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesManager = r.managerName.toLowerCase().includes(query);
        const matchesBranch = r.branchName.toLowerCase().includes(query);
        const matchesRef = r.bankReferenceNumber?.toLowerCase().includes(query) ?? false;
        if (!matchesManager && !matchesBranch && !matchesRef) return false;
      }
      return true;
    });
  }, [records, tabFilter, branchFilter, searchQuery]);

  const updateRecordStatus = useCallback((id: string, updates: Partial<DailySettlementRecord>) => {
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
    searchQuery,
    setSearchQuery,
    availableBranches,
    approvingRecord,
    setApprovingRecord,
    flaggingRecord,
    setFlaggingRecord,
    updateRecordStatus,
  };
}

