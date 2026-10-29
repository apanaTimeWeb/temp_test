'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerCommunicationNotices } from '@/app/frontend_manager/manager_communication/communication_notices/api/manager_communication_notices.api';
import { MANAGER_COMMUNICATION_QUERY_KEYS } from '@/app/frontend_manager/manager_communication/communication_notices/api/manager_communication_notices.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Read-only query hook. Mutation endpoints are intentionally absent until supplied by the host contract. */
export function useManagerCommunicationNotices() {
  const query = useQuery({
    queryKey: MANAGER_COMMUNICATION_QUERY_KEYS.notices,
    queryFn: fetchManagerCommunicationNotices,
  });

  return {
    ...query,
    notices: query.data ?? [],
  };
}
