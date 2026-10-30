import { http, HttpResponse } from 'msw';
import { ADMIN_COMMUNICATION_NOTIFICATION_CENTER_API } from '@/app/frontend_admin/admin_communication/communication_notification_center/config/admin_communication_notification_center.url_config';

/** Synthetic API responses for tests only; they do not prove the live backend supports these contracts. */
export const ADMIN_COMMUNICATION_COMPLAINT_API_FIXTURE = [
  { id: 'CMP-DEMO-001', subject: 'Noise', description: 'Synthetic complaint fixture.', status: 'Open', createdAt: '2026-10-10T09:30:00Z' },
] as const;
export const ADMIN_COMMUNICATION_NOTICE_API_FIXTURE = [
  { id: 'NOTICE-DEMO-001', title: 'Demo notice', message: 'Synthetic notice fixture.', createdAt: '2026-10-10', validTill: '2026-12-31' },
] as const;

export const ADMIN_COMMUNICATION_MSW_HANDLERS = [
  http.get(ADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.COMPLAINTS, () => HttpResponse.json({ success: true, message: 'Synthetic complaint fixture loaded.', data: ADMIN_COMMUNICATION_COMPLAINT_API_FIXTURE, requestId: 'mock-notification-center-complaints' })),
  http.get(ADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.NOTICES, () => HttpResponse.json({ success: true, message: 'Synthetic notice fixture loaded.', data: ADMIN_COMMUNICATION_NOTICE_API_FIXTURE, requestId: 'mock-notification-center-notices' })),
];
