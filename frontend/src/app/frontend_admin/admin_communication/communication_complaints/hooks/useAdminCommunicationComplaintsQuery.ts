'use client';
// DATA FLOW: communication_complaints route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.

import { useQuery } from '@tanstack/react-query';
import { fetchAdminCommunicationComplaints } from '@/app/frontend_admin/admin_communication/communication_complaints/api/admin_communication_complaints_api';
import { ADMIN_COMMUNICATION_QUERY_KEYS } from '@/app/frontend_admin/admin_communication/communication_complaints/api/admin_communication_complaints.query_keys';

/** Owns the module list query while leaving presentation and local filters in the view. */
export default function useAdminCommunicationComplaintsQuery(enabled = true) {
  return useQuery({ queryKey: ADMIN_COMMUNICATION_QUERY_KEYS.list({ resource: 'complaints' }), queryFn: fetchAdminCommunicationComplaints, enabled });
}
