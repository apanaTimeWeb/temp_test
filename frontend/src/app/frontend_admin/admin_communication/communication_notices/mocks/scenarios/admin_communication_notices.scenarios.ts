import { http, HttpResponse } from 'msw';
import { ADMIN_COMMUNICATION_URLS } from '@/app/frontend_admin/admin_communication/communication_notices/config/admin_communication_notices_communication_url_config_source_routes';
import type { AdminCommunicationComplaintApiRecord, AdminCommunicationNoticeApiRecord } from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';

/**
 * Canonical transport-level mock scenario registry for Admin Communication Notices.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminCommunicationNoticesScenarioCatalog = (activeRecords: unknown) => ({
  ACTIVE_RECORDS: {
    kind: 'http-response',
    status: 200,
    envelope: {
      success: true,
      message: 'Module-local populated fixture.',
      data: activeRecords,
      requestId: 'mock-active-records',
    },
  },
  EMPTY_DATA: {
    kind: 'http-response',
    status: 200,
    envelope: {
      success: true,
      message: 'No records returned by the empty-result scenario.',
      data: [],
      requestId: 'mock-empty-data',
    },
  },
  SERVER_500_ERROR: {
    kind: 'http-response',
    status: 500,
    envelope: {
      success: false,
      message: 'Simulated internal server error.',
      data: null,
      errorCode: 'ERR_INTERNAL_500',
      statusCode: 500,
      requestId: 'mock-server-500',
    },
  },
  NETWORK_TIMEOUT: {
    kind: 'delayed-http-response',
    delayMs: 15000,
    status: 504,
    envelope: {
      success: false,
      message: 'Simulated request timeout.',
      data: null,
      errorCode: 'ERR_TIMEOUT',
      statusCode: 504,
      requestId: 'mock-network-timeout',
    },
  },
  UNAUTHORIZED_401: {
    kind: 'http-response',
    status: 401,
    envelope: {
      success: false,
      message: 'Simulated unauthenticated request.',
      data: null,
      errorCode: 'ERR_UNAUTHORIZED',
      statusCode: 401,
      requestId: 'mock-unauthorized-401',
    },
  },
  FORBIDDEN_403: {
    kind: 'http-response',
    status: 403,
    envelope: {
      success: false,
      message: 'Simulated authenticated request without permission.',
      data: null,
      errorCode: 'ERR_FORBIDDEN',
      statusCode: 403,
      requestId: 'mock-forbidden-403',
    },
  },
  NETWORK_ERROR: {
    kind: 'transport-error',
    transport: 'fetch-rejection',
    message: 'Simulated network failure without an HTTP response.',
  },
  INVALID_RESPONSE: {
    kind: 'malformed-success-envelope',
    status: 200,
    envelope: {
      success: true,
      message: 'Deliberately malformed response: required data and requestId are absent.',
    },
  },
} as const);

/** Test-only frontend read handlers. Mutation contracts are intentionally not mocked. */
export const ADMIN_COMMUNICATION_MSW_HANDLERS = [
  http.get(ADMIN_COMMUNICATION_URLS.COMPLAINTS, () => HttpResponse.json({ success: true, message: 'Synthetic complaint fixture loaded.', data: ADMIN_COMMUNICATION_COMPLAINT_API_FIXTURE, requestId: 'mock-communication-notices-complaints' })),
  http.get(ADMIN_COMMUNICATION_URLS.NOTICES, () => HttpResponse.json({ success: true, message: 'Synthetic notice fixture loaded.', data: ADMIN_COMMUNICATION_NOTICE_API_FIXTURE, requestId: 'mock-communication-notices-list' })),
];

/** Synthetic response records used only by API-layer tests. */
export const ADMIN_COMMUNICATION_COMPLAINT_API_FIXTURE: AdminCommunicationComplaintApiRecord[] = [
  { id: 'CMP-DEMO-001', subject: 'Demo complaint', description: 'Synthetic test complaint', status: 'Open', createdAt: '2026-10-13T08:00:00.000Z' },
];
export const ADMIN_COMMUNICATION_NOTICE_API_FIXTURE: AdminCommunicationNoticeApiRecord[] = [
  { id: 'NOTICE-DEMO-001', title: 'Demo notice', message: 'Synthetic test notice', createdAt: '2026-10-13T08:00:00.000Z', validTill: '2026-10-31T23:59:59.000Z' },
];
