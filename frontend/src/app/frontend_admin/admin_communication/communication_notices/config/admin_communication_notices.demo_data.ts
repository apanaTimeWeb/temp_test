import type { AdminCommunicationNoticeApiRecord } from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';

/** Synthetic response records used only by API-layer tests and explicit demo mode. */
export const ADMIN_COMMUNICATION_NOTICE_DEMO_DATA: AdminCommunicationNoticeApiRecord[] = [
  { id: 'NOTICE-DEMO-001', title: 'Demo notice', message: 'Synthetic test notice', createdAt: '2026-10-13T08:00:00.000Z', validTill: '2026-10-31T23:59:59.000Z' },
];
