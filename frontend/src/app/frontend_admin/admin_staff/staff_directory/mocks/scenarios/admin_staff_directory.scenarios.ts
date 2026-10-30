import type { AdminStaffDirectoryManager } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import type { z } from 'zod';
import { AdminStaffDirectoryApiResponseSchema } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';

/**
 * Canonical transport-level mock scenario registry for Admin Staff Directory.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminStaffDirectoryScenarioCatalog = (activeRecords: unknown) => ({
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

export const ADMIN_STAFF_DIRECTORY_FIXTURE_DATA: readonly AdminStaffDirectoryManager[] = [
  { id: 'MGR-001', name: 'Vikram Singh', username: 'vikram.s', email: 'vikram@smartlibrary.com', phone: '+91 9876543210', branch: 'Downtown Central', status: 'Active', lastActive: '2 mins ago' },
  { id: 'MGR-002', name: 'Anita Desai', username: 'anita.d', email: 'anita@smartlibrary.com', phone: '+91 9876543211', branch: 'Westside Branch', status: 'Active', lastActive: '1 hr ago' },
  { id: 'MGR-003', name: 'Rahul Sharma', username: 'rahul.s', email: 'rahul@smartlibrary.com', phone: '+91 9876543212', branch: 'North Hub', status: 'Suspended', lastActive: '3 days ago' },
  { id: 'MGR-004', name: 'Sneha Verma', username: 'sneha.v', email: 'sneha@smartlibrary.com', phone: '+91 9876543213', branch: 'Unassigned', status: 'Deactivated', lastActive: '1 month ago' },
];

/** Synthetic staff contract fixture; not a real identity or account. */
export const ADMIN_STAFF_DIRECTORY_API_FIXTURE: z.infer<typeof AdminStaffDirectoryApiResponseSchema> = [
  { id: 'STAFF-DEMO-001', name: 'Demo Manager', username: 'demo.manager', email: 'manager@example.invalid', phone: '+91 90000 00031', branch: 'Demo Branch', status: 'Active', lastActive: 'Never (synthetic fixture)' },
];

/** Synthetic demo-only records. They are never treated as live session/audit API evidence. */
export const ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES = [
  { managerName: 'Demo Manager', operatingSystem: 'Demo browser / operating system', ipAddress: '192.0.2.10', timeKey: 'LAST_ACTIVE_TWO_MINUTES' },
] as const;

export const ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES = [
  { managerName: 'Demo Manager', timeKey: 'TIME_TODAY_0900', statusKey: 'STATUS_SUCCESS', location: 'Synthetic demo location' },
  { managerName: 'Demo Manager', timeKey: 'TIME_YESTERDAY_1015', statusKey: 'STATUS_FAILED', location: 'Synthetic demo location' },
] as const;

export const ADMIN_STAFF_DIRECTORY_ACTIVITY_FIXTURES = [
  { managerName: 'Demo Manager', timeKey: 'TIME_JUST_NOW', actionKey: 'ACTIVITY_ADMISSION_APPROVED' },
  { managerName: 'Demo Manager', timeKey: 'TIME_TWO_HOURS', actionKey: 'ACTIVITY_PRICING_UPDATED' },
] as const;

export const ADMIN_STAFF_DIRECTORY_MANAGER_HISTORY_FIXTURES = [
  { timeKey: 'TIME_TODAY_0900', device: 'Synthetic demo device · 192.0.2.11', statusKey: 'DETAIL_TABLE_SUCCESS' },
  { timeKey: 'TIME_YESTERDAY_1015', device: 'Synthetic demo device · 192.0.2.12', statusKey: 'DETAIL_TABLE_FAILED' },
] as const;

export const ADMIN_STAFF_DIRECTORY_MANAGER_ACTIVITY_FIXTURES = [
  { timeKey: 'TIME_JUST_NOW', actionKey: 'ACTIVITY_ADMISSION_APPROVED' },
  { timeKey: 'TIME_TWO_HOURS', actionKey: 'ACTIVITY_BRANCH_PRICING_UPDATED' },
] as const;
