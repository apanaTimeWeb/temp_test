'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerMembersEnquiries } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.api';
import { MANAGER_CRM_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.query_keys';
import type { ManagerMembersEnquiriesEnquiry, ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import type { ManagerMembersEnquiriesBoardViewMode } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

export type ManagerCrmTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

function useManagerEnquiriesEnquiryDebounce(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value);
  // Dependency rationale: restart the debounce timer when either the input value or configured delay changes.
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeout);
  }, [value, delayMs]);
  return debounced;
}

function parseEnquiryDateToMs(enquiry: ManagerMembersEnquiriesEnquiry): number | null {
  const candidates = [enquiry.enquiryDate, enquiry.addedDate];
  for (const raw of candidates) {
    if (!raw) continue;
    if (/^today/i.test(raw)) return Date.now();
    if (/^yesterday/i.test(raw)) return Date.now() - 86400000;
    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) return parsed;
    // Match "24 May" or "May 24" with current year
    const dayMonth = /^(\d{1,2})\s+([A-Za-z]+)/.exec(raw) || /^([A-Za-z]+)\s+(\d{1,2})/.exec(raw);
    if (dayMonth) {
      const parsedWithYear = Date.parse(`${raw} ${new Date().getFullYear()}`);
      if (!Number.isNaN(parsedWithYear)) return parsedWithYear;
    }
  }
  return null;
}

export function useManagerMembersEnquiries() {
  const query = useQuery({ queryKey: MANAGER_CRM_QUERY_KEYS.enquiries(), queryFn: fetchManagerMembersEnquiries, staleTime: 30_000 });
  const [view, setView] = useState<ManagerMembersEnquiriesBoardViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ManagerMembersEnquiriesEnquiryStatus | 'All'>('All');
  const [timeHorizon, setTimeHorizon] = useState<ManagerCrmTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const debouncedSearch = useManagerEnquiriesEnquiryDebounce(search, 300);

  const filtered = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim();
    const needle = normalizedSearch.toLowerCase();
    const digits = normalizedSearch.replace(/\D/g, '');

    const now = new Date();
    const startOfTodayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeekMs = startOfTodayMs - ((now.getDay() || 7) - 1) * 86400000;
    const endOfWeekMs = startOfWeekMs + 7 * 86400000 - 1;
    const startOfMonthMs = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const endOfMonthMs = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();
    const customFromMs = customStartDate ? new Date(`${customStartDate}T00:00:00`).getTime() : null;
    const customToMs = customEndDate ? new Date(`${customEndDate}T23:59:59`).getTime() : null;

    return (query.data ?? []).filter((enquiry) => {
      // 1. Text & Phone Search
      const matchSearch = !needle || enquiry.name.toLowerCase().includes(needle) || Boolean(digits && enquiry.phone.includes(digits));
      if (!matchSearch) return false;

      // 2. Status Filter
      const matchStatus = statusFilter === 'All' || enquiry.status === statusFilter;
      if (!matchStatus) return false;

      // 3. Time Horizon Filter
      if (timeHorizon === 'all') return true;

      if (timeHorizon === 'today') {
        if (enquiry.isToday) return true;
        const enqMs = parseEnquiryDateToMs(enquiry);
        return enqMs !== null && enqMs >= startOfTodayMs && enqMs < startOfTodayMs + 86400000;
      }

      if (timeHorizon === 'this_week') {
        if (enquiry.isToday || enquiry.isUpcoming || enquiry.isOverdue) return true;
        const enqMs = parseEnquiryDateToMs(enquiry);
        return enqMs !== null && enqMs >= startOfWeekMs && enqMs <= endOfWeekMs;
      }

      if (timeHorizon === 'this_month') {
        const enqMs = parseEnquiryDateToMs(enquiry);
        if (enqMs !== null) {
          return enqMs >= startOfMonthMs && enqMs <= endOfMonthMs;
        }
        return true;
      }

      if (timeHorizon === 'custom') {
        const enqMs = parseEnquiryDateToMs(enquiry);
        if (enqMs === null) return true;
        if (customFromMs !== null && enqMs < customFromMs) return false;
        if (customToMs !== null && enqMs > customToMs) return false;
        return true;
      }

      return true;
    });
  }, [query.data, debouncedSearch, statusFilter, timeHorizon, customStartDate, customEndDate]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const newLeads = filtered.filter((e) => e.status === 'New').length;
    const visited = filtered.filter((e) => e.status === 'Visited').length;
    const interested = filtered.filter((e) => e.status === 'Interested').length;
    const converted = filtered.filter((e) => e.status === 'Converted').length;
    const lost = filtered.filter((e) => e.status === 'Lost').length;
    const activePipeline = visited + interested;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
    return { total, newLeads, visited, interested, converted, lost, activePipeline, conversionRate };
  }, [filtered]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkWhatsAppModalOpen, setBulkWhatsAppModalOpen] = useState(false);

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const allFilteredIds = filtered.map((e) => e.id);
      const allSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !allFilteredIds.includes(id));
      }
      return Array.from(new Set([...prev, ...allFilteredIds]));
    });
  };

  const selectByStatus = (status: ManagerMembersEnquiriesEnquiryStatus) => {
    const statusIds = filtered.filter((e) => e.status === status).map((e) => e.id);
    setSelectedIds((prev) => {
      const allSelected = statusIds.length > 0 && statusIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !statusIds.includes(id));
      }
      return Array.from(new Set([...prev, ...statusIds]));
    });
  };

  const selectAllFiltered = () => {
    setSelectedIds(filtered.map((e) => e.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const selectedEnquiries = useMemo(
    () => (query.data ?? []).filter((e) => selectedIds.includes(e.id)),
    [query.data, selectedIds]
  );

  const getCardsByStatus = (status: ManagerMembersEnquiriesEnquiryStatus): ManagerMembersEnquiriesEnquiry[] =>
    filtered.filter((enquiry) => enquiry.status === status);

  return {
    ...query,
    filtered,
    view,
    setView,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    timeHorizon,
    setTimeHorizon,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    stats,
    getCardsByStatus,
    selectedIds,
    setSelectedIds,
    selectedEnquiries,
    bulkWhatsAppModalOpen,
    setBulkWhatsAppModalOpen,
    toggleSelectOne,
    toggleSelectAll,
    selectByStatus,
    selectAllFiltered,
    clearSelection,
  };
}
