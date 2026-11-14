// FLOW: Feature caller -> superadmin_communication/communication_notices/api/superadmin_communication_notices_read.api.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Responsibility: Communication Notices read API boundary; owns only the notices resource. */
import { apiFetch } from '@/lib/api';
import { parseSuperadminCommunicationNoticesApiResponse } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/utils/SuperadminCommunicationNoticesApiResponse';
import { SUPERADMIN_COMMUNICATION_NOTICES_API as __SUPERADMIN_COMMUNICATION_NOTICES_API } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/config/superadmin_communication_notices.url_config';
import { SuperadminCommunicationNoticesResponseSchema } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/schemas/SuperadminCommunicationNoticesSchema';
import type { SuperadminCommunicationNotice } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/types/SuperadminCommunicationNoticesTypes';

function SuperadminCommunicationDateOnly(value: string | undefined, fallback = ''): string {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : fallback;
}

/** Fetches and runtime-validates the currently documented notice-list response. */
export async function fetchSuperadminCommunicationNotices(): Promise<SuperadminCommunicationNotice[]> {
  const payload: unknown = await apiFetch(__SUPERADMIN_COMMUNICATION_NOTICES_API.NOTICES_LIST);
  const rows = parseSuperadminCommunicationNoticesApiResponse(payload, (data) => SuperadminCommunicationNoticesResponseSchema.parse(data));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return rows.map((item) => {
    const expiry = item.validTill ? new Date(item.validTill) : null;
    const validExpiry = expiry && Number.isFinite(expiry.getTime()) ? expiry : null;
    return {
      id: item.id,
      title: item.title ?? '',
      message: item.message ?? '',
      postedBy: '',
      postedDate: SuperadminCommunicationDateOnly(item.createdAt),
      validTill: SuperadminCommunicationDateOnly(item.validTill),
      status: validExpiry && validExpiry >= today ? 'Active' : 'Expired',
    };
  });
}
