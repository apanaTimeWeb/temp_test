'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerWhatsappTemplatesNotices } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/api/manager_communication_whatsapp_templates.api';
import { MANAGER_COMMUNICATION_QUERY_KEYS } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/api/manager_communication_whatsapp_templates.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Read-only query hook. Mutation endpoints are intentionally absent until supplied by the host contract. */
export function useManagerWhatsappTemplatesNotices() {
  const query = useQuery({
    queryKey: MANAGER_COMMUNICATION_QUERY_KEYS.notices,
    queryFn: fetchManagerWhatsappTemplatesNotices,
  });

  return {
    ...query,
    notices: query.data ?? [],
  };
}
