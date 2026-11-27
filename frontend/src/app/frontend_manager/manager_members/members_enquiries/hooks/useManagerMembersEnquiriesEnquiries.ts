'use client';

import { fetchManagerMembersEnquiries } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.api';
import { MANAGER_CRM_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.query_keys';
import type { ManagerMembersEnquiriesBoardViewMode } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';
import type { ManagerMembersEnquiriesEnquiry, ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import {
  computeEnquiryStats,
  filterManagerEnquiries,
  persistEnquiryLostState,
  type ManagerCrmTimeHorizon,
} from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesPipelineHelpers';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

export type { ManagerCrmTimeHorizon };

function useManagerEnquiriesEnquiryDebounce(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeout);
  }, [value, delayMs]);
  return debounced;
}

export function useManagerMembersEnquiries() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: MANAGER_CRM_QUERY_KEYS.enquiries(), queryFn: fetchManagerMembersEnquiries, staleTime: 30_000 });
  const [view, setView] = useState<ManagerMembersEnquiriesBoardViewMode>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ManagerMembersEnquiriesEnquiryStatus | 'All'>('All');
  const [timeHorizon, setTimeHorizon] = useState<ManagerCrmTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkWhatsAppModalOpen, setBulkWhatsAppModalOpen] = useState(false);

  const debouncedSearch = useManagerEnquiriesEnquiryDebounce(search, 300);

  const filtered = useMemo(
    () => filterManagerEnquiries(query.data ?? [], debouncedSearch, statusFilter, timeHorizon, customStartDate, customEndDate),
    [query.data, debouncedSearch, statusFilter, timeHorizon, customStartDate, customEndDate],
  );

  const stats = useMemo(() => computeEnquiryStats(filtered), [filtered]);

  const toggleSelectOne = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const allIds = filtered.map((e) => e.id);
      return allIds.length > 0 && allIds.every((id) => prev.includes(id))
        ? prev.filter((id) => !allIds.includes(id))
        : Array.from(new Set([...prev, ...allIds]));
    });
  };

  const selectByStatus = (status: ManagerMembersEnquiriesEnquiryStatus) => {
    const statusIds = filtered.filter((e) => e.status === status).map((e) => e.id);
    setSelectedIds((prev) =>
      statusIds.length > 0 && statusIds.every((id) => prev.includes(id))
        ? prev.filter((id) => !statusIds.includes(id))
        : Array.from(new Set([...prev, ...statusIds])),
    );
  };

  const selectAllFiltered = () => setSelectedIds(filtered.map((e) => e.id));
  const clearSelection = () => setSelectedIds([]);

  const selectedEnquiries = useMemo(
    () => (query.data ?? []).filter((e) => selectedIds.includes(e.id)),
    [query.data, selectedIds],
  );

  const deleteSelected = (targetIds?: string[]) => {
    const toDelete = targetIds ?? selectedIds;
    if (toDelete.length === 0) return;
    queryClient.setQueryData<ManagerMembersEnquiriesEnquiry[]>(MANAGER_CRM_QUERY_KEYS.enquiries(), (old) => (old ?? []).filter((e) => !toDelete.includes(e.id)));
    setSelectedIds((prev) => prev.filter((id) => !toDelete.includes(id)));
  };

  const markEnquiryAsLost = (id: string, reason: string, notes?: string) => {
    const todayStr = persistEnquiryLostState(id, reason, notes);
    const remarkText = notes ? `Marked as Lost | Reason: ${reason} | Note: ${notes}` : `Marked as Lost | Reason: ${reason}`;
    const newFollowUp = { id: `lost-${Date.now()}`, date: todayStr, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), remark: remarkText, by: 'Manager (Desk)' };
    queryClient.setQueryData<ManagerMembersEnquiriesEnquiry[]>(MANAGER_CRM_QUERY_KEYS.enquiries(), (old) =>
      (old ?? []).map((e) => (e.id === id ? { ...e, status: 'Lost', lostReason: reason, lostDate: todayStr, followUps: [newFollowUp, ...(e.followUps || [])] } : e)),
    );
  };

  const getCardsByStatus = (status: ManagerMembersEnquiriesEnquiryStatus): ManagerMembersEnquiriesEnquiry[] =>
    filtered.filter((enquiry) => enquiry.status === status);

  return {
    ...query, filtered, view, setView, search, setSearch, statusFilter, setStatusFilter,
    timeHorizon, setTimeHorizon, customStartDate, setCustomStartDate, customEndDate, setCustomEndDate,
    stats, getCardsByStatus, selectedIds, setSelectedIds, selectedEnquiries,
    bulkWhatsAppModalOpen, setBulkWhatsAppModalOpen, toggleSelectOne, toggleSelectAll,
    selectByStatus, selectAllFiltered, clearSelection, deleteSelected, markEnquiryAsLost,
  };
}
