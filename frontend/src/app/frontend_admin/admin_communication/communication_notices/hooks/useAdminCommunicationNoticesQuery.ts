'use client';
// DATA FLOW: communication_notices route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.

import { useQuery } from '@tanstack/react-query';
import { fetchAdminCommunicationNotices } from '@/app/frontend_admin/admin_communication/communication_notices/api/admin_communication_notices_api';
import { ADMIN_COMMUNICATION_QUERY_KEYS } from '@/app/frontend_admin/admin_communication/communication_notices/api/admin_communication_notices.query_keys';

/** Owns the module list query while leaving presentation and local filters in the view. */
export default function useAdminCommunicationNoticesQuery(enabled = true) {
  return useQuery({ queryKey: ADMIN_COMMUNICATION_QUERY_KEYS.list({ resource: 'notices' }), queryFn: fetchAdminCommunicationNotices, enabled });
}
