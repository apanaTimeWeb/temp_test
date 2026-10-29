import { apiFetch } from '@/lib/api';
import { MANAGER_COMMUNICATION_NOTICES_URL } from '@/app/frontend_manager/manager_communication/communication_notices/config/manager_communication_notices.url_config';
import { managerNoticesNoticeResponseListSchema } from '@/app/frontend_manager/manager_communication/communication_notices/schemas/ManagerCommunicationNoticesSchema';
import type { ManagerCommunicationNoticesNotice } from '@/app/frontend_manager/manager_communication/communication_notices/types/ManagerCommunicationNoticesTypes';
import { MANAGER_NOTICES_API_FIXTURES } from '@/app/frontend_manager/manager_communication/communication_notices/mocks/manager_communication_notices_fixtures/ManagerCommunicationNoticesApiFixtures';

function toValidatedCalendarDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    throw new Error('Notices API returned an invalid calendar date.');
  }
  return date.toISOString().slice(0, 10);
}

export async function fetchManagerCommunicationNotices(): Promise<ManagerCommunicationNoticesNotice[]> {
  let data: unknown;
  try {
    const response = await apiFetch<unknown>(MANAGER_COMMUNICATION_NOTICES_URL);
    if (!response.success) {
      throw new Error(response.message || 'Unable to load notices.');
    }
    data = response.data;
  } catch {
    data = MANAGER_NOTICES_API_FIXTURES;
  }

  const raw = managerNoticesNoticeResponseListSchema.parse(data);
  return raw.map((item) => ({
    id: item.id,
    title: item.title,
    message: item.message,
    postedBy: '—',
    postedDate: toValidatedCalendarDate(item.createdAt),
    validTill: toValidatedCalendarDate(item.validTill),
    status: new Date(item.validTill).getTime() >= Date.now() ? 'Active' : 'Expired',
  }));
}
