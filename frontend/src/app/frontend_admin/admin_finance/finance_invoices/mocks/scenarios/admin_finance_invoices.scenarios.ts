import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import type { AdminFinanceDemoInvoice, AdminFinanceDemoInvoiceDetail } from '@/app/frontend_admin/admin_finance/finance_invoices/types/AdminFinanceInvoicesTypes';

/**
 * Canonical transport-level mock scenario registry for Admin Finance Invoices.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminFinanceInvoicesScenarioCatalog = (activeRecords: unknown) => ({
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

/** Demo-only invoice records; never use as live invoice data. */
export const ADMIN_FINANCE_DEMO_INVOICES: readonly AdminFinanceDemoInvoice[] = [
  { id: '1', invoiceNumber: 'INV-20260411-001', studentName: 'Gajodhar Prasad', studentId: 'STU-001234', phone: '9876543210', invoiceDate: '2026-04-11T00:00:00Z', grandTotal: 171600, paymentStatus: 'paid',    paymentMode: 'UPI',          planName: 'Annual Library Membership',       shift: 'Evening', seat: 'B-05' },
  { id: '2', invoiceNumber: 'INV-20260410-002', studentName: 'Aravind Sharma',  studentId: 'STU-002567', phone: '8765432109', invoiceDate: '2026-04-10T00:00:00Z', grandTotal: 120000, paymentStatus: 'paid',    paymentMode: 'Cash',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'A-01' },
  { id: '3', invoiceNumber: 'INV-20260409-003', studentName: 'Priya Nair',      studentId: 'STU-003891', phone: '7654321098', invoiceDate: '2026-04-09T00:00:00Z', grandTotal: 240000, paymentStatus: 'pending', paymentMode: 'Bank Transfer', planName: 'Quarterly Premium Plan',          shift: 'Full Day','seat': 'A-05' },
  { id: '4', invoiceNumber: 'INV-20260408-004', studentName: 'Rohan Khanna',    studentId: 'STU-004312', phone: '6543210987', invoiceDate: '2026-04-08T00:00:00Z', grandTotal: 90000,  paymentStatus: 'paid',    paymentMode: 'Card',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'D-10' },
  { id: '5', invoiceNumber: 'INV-20260407-005', studentName: 'Sara Mishra',     studentId: 'STU-005678', phone: '5432109876', invoiceDate: '2026-04-07T00:00:00Z', grandTotal: 150000, paymentStatus: 'overdue', paymentMode: '',             planName: 'Half-Yearly Plan',                shift: 'Night',   seat: 'C-12' },
];

/** Detail preview extends the first list record so the list route ID and detail route ID cannot drift. */
const primaryDemoInvoice = ADMIN_FINANCE_DEMO_INVOICES[0]!;

export const ADMIN_FINANCE_DEMO_INVOICE_DETAIL: AdminFinanceDemoInvoiceDetail = {
  ...primaryDemoInvoice,
  libraryName: ADMIN_BRAND_CONFIG.displayName,
  libraryAddress: 'Main Branch, Pune',
  libraryGstin: '22AAACP1234B1Z5',
  libraryPhone: '+91 98765 43210',
  studentSmartId: primaryDemoInvoice.studentId,
  studentPhone: primaryDemoInvoice.phone,
  studentAddress: 'Burla, Sambalpur, Odisha',
  invoiceDate: '2026-04-11T00:00:00Z',
  paymentDate: '2026-04-12T00:00:00Z',
  items: [
    { description: 'Annual Library Membership', hsnCode: '9992', duration: '12 months', amount: 120000, gstPercent: 18, gstAmount: 21600 },
    { description: 'Book Issue Fee', hsnCode: '9992', duration: '—', amount: 30000, gstPercent: 0, gstAmount: 0 },
  ],
  subtotal: 150000,
  totalGst: 21600,
  paymentTransactionId: 'UPI-1234567890',
};
