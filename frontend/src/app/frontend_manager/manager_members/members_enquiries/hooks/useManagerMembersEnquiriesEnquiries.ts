'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerMembersEnquiries } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.api';
import { MANAGER_CRM_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.query_keys';
import type { ManagerMembersEnquiriesEnquiry, ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import type { ManagerMembersEnquiriesBoardViewMode } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

function useManagerEnquiriesEnquiryDebounce(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value);
  // Dependency rationale: restart the debounce timer when either the input value or configured delay changes.
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeout);
  }, [value, delayMs]);
  return debounced;
}

export function useManagerMembersEnquiries() {
  const query = useQuery({ queryKey: MANAGER_CRM_QUERY_KEYS.enquiries(), queryFn: fetchManagerMembersEnquiries, staleTime: 30_000 });
  const [view, setView] = useState<ManagerMembersEnquiriesBoardViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ManagerMembersEnquiriesEnquiryStatus | 'All'>('All');
  const debouncedSearch = useManagerEnquiriesEnquiryDebounce(search, 300);
  const filtered = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim();
    const needle = normalizedSearch.toLowerCase();
    const digits = normalizedSearch.replace(/\D/g, '');
    return (query.data ?? []).filter((enquiry) => {
      const matchSearch = !needle || enquiry.name.toLowerCase().includes(needle) || Boolean(digits && enquiry.phone.includes(digits));
      const matchStatus = statusFilter === 'All' || enquiry.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [query.data, debouncedSearch, statusFilter]);
  const getCardsByStatus = (status: ManagerMembersEnquiriesEnquiryStatus): ManagerMembersEnquiriesEnquiry[] => filtered.filter((enquiry) => enquiry.status === status);
  return { ...query, filtered, view, setView, search, setSearch, statusFilter, setStatusFilter, getCardsByStatus };
}
