import { http, HttpResponse } from 'msw';
import { ADMIN_COMMUNICATION_COMPLAINTS_API } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import type { AdminCommunicationComplaintApiRecord, AdminCommunicationNoticeApiRecord } from '@/app/frontend_admin/admin_communication/communication_complaints/schemas/AdminCommunicationComplaintsSchema';

/** Test-only frontend read handlers. Mutation contracts are intentionally not mocked. */
export const ADMIN_COMMUNICATION_MSW_HANDLERS = [
  http.get(ADMIN_COMMUNICATION_COMPLAINTS_API.COMPLAINTS, () => HttpResponse.json({ success: true, message: 'Synthetic complaint fixture loaded.', data: ADMIN_COMMUNICATION_COMPLAINT_API_FIXTURE, requestId: 'mock-communication-complaints-list' })),
  http.get(ADMIN_COMMUNICATION_COMPLAINTS_API.NOTICES, () => HttpResponse.json({ success: true, message: 'Synthetic notice fixture loaded.', data: ADMIN_COMMUNICATION_NOTICE_API_FIXTURE, requestId: 'mock-communication-complaints-notices' })),
];

/** Synthetic response records used only by API-layer tests. */
export const ADMIN_COMMUNICATION_COMPLAINT_API_FIXTURE: AdminCommunicationComplaintApiRecord[] = [
  { id: 'CMP-DEMO-001', subject: 'Demo complaint', description: 'Synthetic test complaint', status: 'Open', createdAt: '2026-10-13T08:00:00.000Z' },
];
export const ADMIN_COMMUNICATION_NOTICE_API_FIXTURE: AdminCommunicationNoticeApiRecord[] = [
  { id: 'NOTICE-DEMO-001', title: 'Demo notice', message: 'Synthetic test notice', createdAt: '2026-10-13T08:00:00.000Z', validTill: '2026-10-31T23:59:59.000Z' },
];
