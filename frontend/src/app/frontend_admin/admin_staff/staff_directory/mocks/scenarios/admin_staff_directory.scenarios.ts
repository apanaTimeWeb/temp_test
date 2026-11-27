import {
  ADMIN_STAFF_DIRECTORY_ACTIVITY_DEMO_DATA,
  ADMIN_STAFF_DIRECTORY_API_DEMO_DATA,
  ADMIN_STAFF_DIRECTORY_DEMO_DATA,
  ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_DEMO_DATA,
  ADMIN_STAFF_DIRECTORY_MANAGER_ACTIVITY_DEMO_DATA,
  ADMIN_STAFF_DIRECTORY_MANAGER_HISTORY_DEMO_DATA,
  ADMIN_STAFF_DIRECTORY_SESSION_DEMO_DATA,
} from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.demo_data';
import type { AdminStaffDirectoryManager } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import { AdminStaffDirectoryApiResponseSchema } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import type { z } from 'zod';

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

export const ADMIN_STAFF_DIRECTORY_FIXTURE_DATA: readonly AdminStaffDirectoryManager[] = ADMIN_STAFF_DIRECTORY_DEMO_DATA;
export const ADMIN_STAFF_DIRECTORY_API_FIXTURE: z.infer<typeof AdminStaffDirectoryApiResponseSchema> = ADMIN_STAFF_DIRECTORY_API_DEMO_DATA;
export const ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES = ADMIN_STAFF_DIRECTORY_SESSION_DEMO_DATA;
export const ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES = ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_DEMO_DATA;
export const ADMIN_STAFF_DIRECTORY_ACTIVITY_FIXTURES = ADMIN_STAFF_DIRECTORY_ACTIVITY_DEMO_DATA;
export const ADMIN_STAFF_DIRECTORY_MANAGER_HISTORY_FIXTURES = ADMIN_STAFF_DIRECTORY_MANAGER_HISTORY_DEMO_DATA;
export const ADMIN_STAFF_DIRECTORY_MANAGER_ACTIVITY_FIXTURES = ADMIN_STAFF_DIRECTORY_MANAGER_ACTIVITY_DEMO_DATA;
