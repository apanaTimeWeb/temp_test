import type { AdminCollectFeeMockStudent } from '@/app/frontend_admin/admin_finance/finance_collect_fee/types/AdminFinanceCollectFeeTypes';

/**
 * Canonical transport-level mock scenario registry for Admin Finance Collect Fee.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminFinanceCollectFeeScenarioCatalog = (activeRecords: unknown) => ({
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

/** Synthetic rows are visible only when the explicit frontend demo flag is enabled. */
export const ADMIN_COLLECT_FEE_PAYMENT_COUPONS = { SAVE50: 5000, FRIEND100: 10000 } as const;
export const ADMIN_COLLECT_FEE_MOCK_STUDENTS: readonly AdminCollectFeeMockStudent[] = [
  { id: 1, name: 'Aarav Sharma', smartId: 'STU001', phone: '8084350824', status: 'active', dueAmountMinor: 0, plan: 'Premium Plan', shift: 'Morning', seat: 'A-01', validUpto: '10 Nov 2024' },
  { id: 2, name: 'Priya Patel', smartId: 'STU002', phone: '8084350824', status: 'active', dueAmountMinor: 180000, plan: 'Basic Plan', shift: 'Evening', seat: 'B-05', validUpto: '01 Oct 2024' },
  { id: 3, name: 'Rohan Kumar', smartId: 'STU003', phone: '8084350824', status: 'expired', dueAmountMinor: 400000, plan: 'Premium Plan', shift: 'Night', seat: 'C-12', validUpto: '15 Sep 2024' },
  { id: 4, name: 'Sneha Singh', smartId: 'STU004', phone: '8084350824', status: 'suspended', dueAmountMinor: 450000, plan: 'Basic Plan', shift: 'Morning', seat: 'A-08', validUpto: '01 Sep 2024' },
  { id: 5, name: 'Vikram Rao', smartId: 'STU005', phone: '8084350824', status: 'active', dueAmountMinor: 0, plan: 'Elite Plan', shift: 'Full Day', seat: 'D-03', validUpto: '20 Dec 2024' },
  { id: 6, name: 'Ananya Gupta', smartId: 'STU006', phone: '8084350824', status: 'active', dueAmountMinor: 0, plan: 'Basic Plan', shift: 'Evening', seat: 'B-10', validUpto: '15 Nov 2024' },
];
