'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerCommunicationComplaints } from '@/app/frontend_manager/manager_communication/communication_complaints/api/manager_communication_complaints.api';
import { MANAGER_COMMUNICATION_QUERY_KEYS } from '@/app/frontend_manager/manager_communication/communication_complaints/api/manager_communication_complaints.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Read-only query hook. Mutation endpoints are intentionally absent until supplied by the host contract. */
export function useManagerCommunicationComplaints() {
  const query = useQuery({
    queryKey: MANAGER_COMMUNICATION_QUERY_KEYS.complaints,
    queryFn: fetchManagerCommunicationComplaints,
  });

  return {
    ...query,
    complaints: query.data ?? [],
  };
}
