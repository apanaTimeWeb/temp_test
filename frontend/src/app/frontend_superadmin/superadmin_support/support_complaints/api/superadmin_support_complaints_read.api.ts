// FLOW: Feature caller -> superadmin_support/support_complaints/api/superadmin_support_complaints_read.api.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Responsibility: Support Complaints read API boundary; owns only the complaints resource. */
import { apiFetch } from '@/lib/api';
import { parseSuperadminSupportComplaintsApiResponse } from '@/app/frontend_superadmin/superadmin_support/support_complaints/utils/SuperadminSupportComplaintsApiResponse';
import { SUPERADMIN_SUPPORT_COMPLAINTS_API as __SUPERADMIN_SUPPORT_COMPLAINTS_API } from '@/app/frontend_superadmin/superadmin_support/support_complaints/config/superadmin_support_complaints.url_config';
import { SuperadminSupportComplaintsResponseSchema } from '@/app/frontend_superadmin/superadmin_support/support_complaints/schemas/SuperadminSupportComplaintsSchema';
import { mapSuperadminSupportComplaintResponse } from '@/app/frontend_superadmin/superadmin_support/support_complaints/utils/SuperadminSupportComplaintsComplaintMapper';
import type { SuperadminSupportComplaint } from '@/app/frontend_superadmin/superadmin_support/support_complaints/types/SuperadminSupportComplaintsTypes';

/** Fetches and runtime-validates the currently documented complaint-list response. */
export async function fetchSuperadminSupportComplaints(): Promise<SuperadminSupportComplaint[]> {
  const payload: unknown = await apiFetch(__SUPERADMIN_SUPPORT_COMPLAINTS_API.COMPLAINTS_LIST);
  const rows = parseSuperadminSupportComplaintsApiResponse(payload, (data) => SuperadminSupportComplaintsResponseSchema.parse(data));
  return rows.map(mapSuperadminSupportComplaintResponse);
}
