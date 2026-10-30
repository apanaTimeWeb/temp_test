import type { AdminFinanceDeposit } from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';

/**
 * Canonical transport-level mock scenario registry for Admin Finance Security Deposits.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminFinanceSecurityDepositsScenarioCatalog = (activeRecords: unknown) => ({
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

export const ADMIN_FINANCE_DEMO_SECURITY_DEPOSITS: readonly AdminFinanceDeposit[] = [
  { id: 1, studentName: 'Rahul Kumar', smartId: 'STU101', depositAmount: 1000000, collectedBy: 'Admin', collectedDate: '2026-03-15', deductionAmount: 0, status: 'held' },
  { id: 2, studentName: 'Priya Singh', smartId: 'STU102', depositAmount: 800000, collectedBy: 'Manager', collectedDate: '2026-03-20', deductionAmount: 150000, deductionReason: 'Damaged property', status: 'held' },
  { id: 3, studentName: 'Aman Verma', smartId: 'STU103', depositAmount: 1200000, collectedBy: 'Admin', collectedDate: '2026-02-10', deductionAmount: 0, status: 'refunded', refundedDate: '2026-04-08' },
  { id: 4, studentName: 'Sneha Patel', smartId: 'STU104', depositAmount: 900000, collectedBy: 'Admin', collectedDate: '2026-03-05', deductionAmount: 900000, deductionReason: 'Multiple violations', status: 'forfeited' },
  { id: 5, studentName: 'Vikas Sharma', smartId: 'STU105', depositAmount: 1100000, collectedBy: 'Manager', collectedDate: '2026-04-01', deductionAmount: 0, status: 'held' },
];
