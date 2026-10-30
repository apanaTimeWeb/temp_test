import type { AdminStudentsRawStudent } from '@/app/frontend_admin/admin_members/members_students/types/AdminMembersStudentsTypes';
import type { z } from 'zod';
import { AdminStudentsApiResponseSchema } from '@/app/frontend_admin/admin_members/members_students/schemas/AdminMembersStudentsApiSchema';

/**
 * Canonical transport-level mock scenario registry for Admin Members Students.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminMembersStudentsScenarioCatalog = (activeRecords: unknown) => ({
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

export const ADMIN_STUDENTS_FIXTURES: readonly AdminStudentsRawStudent[] = [
  { id: '1001', fullName: 'Rahul Sharma', phone: '+91 9876543210', joinDate: '01 Jan 2024', expiryDate: '01 Jan 2025', branch: 'Main Branch', status: 'Active', shift: 'Morning', seat: 'A-01', plan: 'Premium', locker: 'L-02', feeStatus: 'Paid', totalPaidMinor: 1200000, dueFeeMinor: 0, currencyCode: 'INR', consecutiveAbsent: 0 },
  { id: '1002', fullName: 'Sneha Patil', phone: '+91 9123456789', joinDate: '15 Feb 2024', expiryDate: '15 Aug 2024', branch: 'Main Branch', status: 'Active', shift: 'Evening', seat: 'B-05', plan: 'Basic', locker: '—', feeStatus: 'Paid', totalPaidMinor: 480000, dueFeeMinor: 0, currencyCode: 'INR', consecutiveAbsent: 1 },
  { id: '1003', fullName: 'Amit Kumar', phone: '+91 9988776655', joinDate: '10 Mar 2024', expiryDate: '10 Sep 2024', branch: 'Main Branch', status: 'Suspended', shift: 'Morning', seat: 'C-12', plan: 'Premium', locker: 'L-07', feeStatus: 'Due', totalPaidMinor: 600000, dueFeeMinor: 300000, currencyCode: 'INR', consecutiveAbsent: 7 },
  { id: '1004', fullName: 'Priya Singh', phone: '+91 9001122334', joinDate: '01 Apr 2024', expiryDate: '01 Oct 2024', branch: 'Downtown Branch', status: 'Active', shift: 'Full Day', seat: 'D-03', plan: 'Elite', locker: 'L-11', feeStatus: 'Paid', totalPaidMinor: 960000, dueFeeMinor: 0, currencyCode: 'INR', consecutiveAbsent: 0 },
  { id: '1005', fullName: 'Vikram Verma', phone: '+91 9888123456', joinDate: '20 May 2024', expiryDate: '20 Nov 2024', branch: 'Main Branch', status: 'Blocked', shift: 'Evening', seat: '—', plan: 'Basic', locker: '—', feeStatus: 'Due', totalPaidMinor: 240000, dueFeeMinor: 180000, currencyCode: 'INR', consecutiveAbsent: 14 },
  { id: '1006', fullName: 'Kavita Rao', phone: '+91 9777654321', joinDate: '05 Jun 2024', expiryDate: '05 Dec 2024', branch: 'Main Branch', status: 'Active', shift: 'Morning', seat: 'A-08', plan: 'Premium', locker: '—', feeStatus: 'Paid', totalPaidMinor: 800000, dueFeeMinor: 0, currencyCode: 'INR', consecutiveAbsent: 0 },
];

/** Synthetic data for explicit frontend demo mode only; never represents a live API response. */
export const ADMIN_STUDENTS_API_FIXTURE: z.infer<typeof AdminStudentsApiResponseSchema> =
  AdminStudentsApiResponseSchema.parse(ADMIN_STUDENTS_FIXTURES);

/**
 * No Students API request handler is registered because the supplied source
 * has no verified live endpoint. An invented handler URL would mask the
 * contract defect; demo records are loaded directly under the explicit demo flag.
 * Add the real endpoint handler only when the authoritative API contract arrives.
 */
export const ADMIN_STUDENTS_MSW_HANDLERS = [] as const;
