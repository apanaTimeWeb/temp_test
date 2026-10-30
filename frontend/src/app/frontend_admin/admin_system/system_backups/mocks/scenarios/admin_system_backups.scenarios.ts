import type { AdminSystemBackupRecord } from '@/app/frontend_admin/admin_system/system_backups/types/AdminSystemBackupsTypes';

/**
 * Canonical transport-level mock scenario registry for Admin System Backups.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminSystemBackupsScenarioCatalog = (activeRecords: unknown) => ({
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

/** Historical sample rows for the preview only; never presented as live backup activity. */
export const ADMIN_SYSTEM_BACKUP_HISTORY: AdminSystemBackupRecord[] = [
  { id: 'bk-001', name: 'Nightly Auto Backup', type: 'auto', size: '4.2 MB', createdAt: '2026-04-12 02:00 AM', status: 'success', modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses'] },
  { id: 'bk-002', name: 'Nightly Auto Backup', type: 'auto', size: '4.1 MB', createdAt: '2026-04-11 02:00 AM', status: 'success', modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses'] },
  { id: 'bk-003', name: 'Manual Backup — Pre-Import', type: 'manual', size: '4.0 MB', createdAt: '2026-04-10 11:30 AM', status: 'success', modules: ['Students', 'Payments', 'Seats'] },
  { id: 'bk-004', name: 'Nightly Auto Backup', type: 'auto', size: '—', createdAt: '2026-04-09 02:00 AM', status: 'failed', modules: [] },
  { id: 'bk-005', name: 'Nightly Auto Backup', type: 'auto', size: '3.9 MB', createdAt: '2026-04-08 02:00 AM', status: 'success', modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses'] },
  { id: 'bk-006', name: 'Manual Backup — Monthly', type: 'manual', size: '3.7 MB', createdAt: '2026-04-01 09:00 AM', status: 'success', modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses', 'CRM', 'WhatsApp Logs'] },
];
