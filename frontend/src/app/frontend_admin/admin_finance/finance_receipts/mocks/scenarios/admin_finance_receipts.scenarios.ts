import type { AdminFinanceDemoReceipt, AdminFinanceDemoReceiptDetail } from '@/app/frontend_admin/admin_finance/finance_receipts/types/AdminFinanceReceiptsTypes';

/**
 * Canonical transport-level mock scenario registry for Admin Finance Receipts.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminFinanceReceiptsScenarioCatalog = (activeRecords: unknown) => ({
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

/** Demo-only receipt preview records; these are not proof of recorded payments. */
export const ADMIN_FINANCE_DEMO_RECEIPTS: readonly AdminFinanceDemoReceipt[] = [
  { id: 'SL360-TRX-99421-X', receiptNumber: 'REC-20260411-001', studentName: 'Aravind Sharma',  studentId: 'LIB-2024-883', phone: '9876543210', date: '2026-04-11T00:00:00Z', amount: 124900, paymentMode: 'UPI',          planName: 'Premium Reading Zone (Monthly)',  shift: 'Morning', seat: 'A-01' },
  { id: 'SL360-TRX-88310-Y', receiptNumber: 'REC-20260410-002', studentName: 'Gajodhar Prasad', studentId: 'STU-001234',   phone: '8765432109', date: '2026-04-10T00:00:00Z', amount: 171600, paymentMode: 'UPI',          planName: 'Annual Library Membership',       shift: 'Evening', seat: 'B-05' },
  { id: 'SL360-TRX-77203-Z', receiptNumber: 'REC-20260409-003', studentName: 'Sara Mishra',     studentId: 'STU-008821',   phone: '7654321098', date: '2026-04-09T00:00:00Z', amount: 975000, paymentMode: 'Bank Transfer', planName: 'Security Deposit Refund',         shift: 'Night',   seat: 'C-12' },
  { id: 'SL360-TRX-66192-A', receiptNumber: 'REC-20260408-004', studentName: 'Rohan Khanna',    studentId: 'STU-007654',   phone: '6543210987', date: '2026-04-08T00:00:00Z', amount: 90000,  paymentMode: 'Cash',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'D-10' },
  { id: 'SL360-TRX-55081-B', receiptNumber: 'REC-20260407-005', studentName: 'Priya Nair',      studentId: 'STU-003891',   phone: '5432109876', date: '2026-04-07T00:00:00Z', amount: 240000, paymentMode: 'Card',         planName: 'Quarterly Premium Plan',          shift: 'Full Day','seat': 'A-05' },
];

/** Detail preview is derived from the first list record so the visible list action reaches this fixture. */
const primaryDemoReceipt = ADMIN_FINANCE_DEMO_RECEIPTS[0]!;

export const ADMIN_FINANCE_DEMO_RECEIPT_DETAIL: AdminFinanceDemoReceiptDetail = {
  ...primaryDemoReceipt,
  receiptNo: primaryDemoReceipt.receiptNumber,
  plan: primaryDemoReceipt.planName,
  items: [
    { label: 'Subscription Fee', amount: 120000 },
    { label: 'Processing Fee', amount: 4900 },
  ],
  total: primaryDemoReceipt.amount,
  txnId: 'UPI-9876543210',
};
