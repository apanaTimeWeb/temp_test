import type { AdminSystemBulkImportPreviewRow } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';

/**
 * Canonical transport-level mock scenario registry for Admin System Bulk Import.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminSystemBulkImportScenarioCatalog = (activeRecords: unknown) => ({
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

/** Synthetic rows used only to demonstrate validation states; no uploaded file is parsed. */
export const ADMIN_SYSTEM_BULK_IMPORT_PREVIEW_ROWS: AdminSystemBulkImportPreviewRow[] = [
  { row: 1, name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@gmail.com', shift: 'Morning', seat: 'S-01', status: 'ok' },
  { row: 2, name: 'Priya Verma', phone: '9812345678', email: 'priya@yahoo.com', shift: 'Afternoon', seat: 'S-02', status: 'ok' },
  { row: 3, name: 'Amit Kumar', phone: '', email: 'amit@gmail.com', shift: 'Evening', seat: 'S-03', status: 'error', issue: 'Mobile Number missing' },
  { row: 4, name: 'Sneha Patel', phone: '9999988888', email: '', shift: 'Morning', seat: 'S-04', status: 'warning', issue: 'Email missing (optional)' },
  { row: 5, name: 'Rohan Das', phone: '9870001234', email: 'rohan@gmail.com', shift: 'Afternoon', seat: 'S-05', status: 'ok' },
  { row: 6, name: '', phone: '9810001234', email: 'unknown@gmail.com', shift: 'Morning', seat: 'S-06', status: 'error', issue: 'Student Name is required' },
  { row: 7, name: 'Kavita Singh', phone: '9820001234', email: 'kavita@gmail.com', shift: 'Evening', seat: 'S-07', status: 'ok' },
  { row: 8, name: 'Deepak Mishra', phone: '9830001234', email: 'deepak@gmail.com', shift: 'Morning', seat: '', status: 'error', issue: 'Seat Number missing' },
];
