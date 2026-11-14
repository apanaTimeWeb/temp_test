// FLOW: Feature component -> superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesQueries.ts -> local state/typed dependencies -> returned state and actions.
'use client';
/** Responsibility: Communication Notices query state; owns only the notice list query. */
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_COMMUNICATION_NOTICES_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/api/superadmin_communication_notices.query_keys';
import { fetchSuperadminCommunicationNotices } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/api/superadmin_communication_notices_read.api';

/**
 * Owns the communication notices query lifecycle for communication notices, keeping feature state and side effects within this leaf.
 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminCommunicationNoticesQuery() {
  return useQuery({ queryKey: SUPERADMIN_COMMUNICATION_NOTICES_QUERY_KEYS.lists(), queryFn: fetchSuperadminCommunicationNotices });
}
