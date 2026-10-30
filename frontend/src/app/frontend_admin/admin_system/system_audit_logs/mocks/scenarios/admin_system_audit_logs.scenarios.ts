import { http, HttpResponse } from 'msw';
import { ADMIN_AUDIT_LOGS_URLS } from '@/app/frontend_admin/admin_system/system_audit_logs/config/admin_system_audit_logs.url_config';
import type { z } from 'zod';
import { AdminAuditLogsApiResponseSchema } from '@/app/frontend_admin/admin_system/system_audit_logs/schemas/AdminSystemAuditLogsSchema';

/**
 * Canonical transport-level mock scenario registry for Admin System Audit Logs.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminSystemAuditLogsScenarioCatalog = (activeRecords: unknown) => ({
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

/** Synthetic API-contract records for tests only; not production audit events. */
export const ADMIN_AUDIT_LOGS_API_FIXTURE: z.infer<typeof AdminAuditLogsApiResponseSchema> = [
  { id: 'AUD-DEMO-001', action: 'VIEW', entity: 'Members', module: 'Members', performedBy: 'Demo Admin', role: 'admin', details: 'Synthetic test event', severity: 'info', createdAt: '2026-10-13T09:00:00.000Z', ip: '127.0.0.1' },
];

/** Test-only frontend contract handler. */
export const ADMIN_AUDIT_LOGS_MSW_HANDLERS = [http.get(ADMIN_AUDIT_LOGS_URLS.LIST, () => HttpResponse.json({ success: true, message: 'Synthetic audit log fixture loaded.', data: ADMIN_AUDIT_LOGS_API_FIXTURE, requestId: 'mock-system-audit-logs-list' }))];
