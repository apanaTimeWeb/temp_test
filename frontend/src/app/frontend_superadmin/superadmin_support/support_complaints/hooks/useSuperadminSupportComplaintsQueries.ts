// FLOW: Feature component -> superadmin_support/support_complaints/hooks/useSuperadminSupportComplaintsQueries.ts -> local state/typed dependencies -> returned state and actions.
'use client';
/** Responsibility: Support Complaints query state; owns only the complaint list query. */
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/api/superadmin_support_complaints.query_keys';
import { fetchSuperadminSupportComplaints } from '@/app/frontend_superadmin/superadmin_support/support_complaints/api/superadmin_support_complaints_read.api';

/**
 * Owns the support complaints query lifecycle for support complaints, keeping feature state and side effects within this leaf.
 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminSupportComplaintsQuery() {
  return useQuery({ queryKey: SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS.lists(), queryFn: fetchSuperadminSupportComplaints });
}
