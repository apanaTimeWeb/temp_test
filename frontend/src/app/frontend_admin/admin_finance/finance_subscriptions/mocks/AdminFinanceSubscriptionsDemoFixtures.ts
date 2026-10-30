import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import type { AdminSubscriptionsDemoSubscription } from '@/app/frontend_admin/admin_finance/finance_subscriptions/types/AdminFinanceSubscriptionsTypes';
import type { AdminSubscriptionsDepositStatus, AdminSubscriptionsPromiseItemStatus, AdminSubscriptionsTrustScoreStudentBadge, AdminSubscriptionsTrustScoreStudentShift } from '@/app/frontend_admin/admin_finance/finance_subscriptions/types/AdminFinanceSubscriptionsTypes';

/**
 * Sanitized, explicitly demo-only fixture records for the Finance feature.
 * Never use these rows as live server responses or evidence of persisted actions.
 */
export type AdminSubscriptionsPromiseItem = {
  id: number;
  studentName: string;
  smartId: string;
  promisedAmount: number;
  expectedDate: string;
  daysUntilDue: number;
  timesChanged: number;
  status: AdminSubscriptionsPromiseItemStatus;
  fulfilledDate?: string;
};

export const ADMIN_SUBSCRIPTIONS_DEMO_PAYMENT_PROMISES: readonly AdminSubscriptionsPromiseItem[] = [
  { id: 1, studentName: 'Rahul Kumar', smartId: 'STU101', promisedAmount: 149900, expectedDate: '2026-04-20', daysUntilDue: 9, timesChanged: 0, status: 'pending' },
  { id: 2, studentName: 'Priya Singh', smartId: 'STU102', promisedAmount: 99900, expectedDate: '2026-04-05', daysUntilDue: -6, timesChanged: 1, status: 'overdue' },
  { id: 3, studentName: 'Aman Verma', smartId: 'STU103', promisedAmount: 249900, expectedDate: '2026-03-15', daysUntilDue: -27, timesChanged: 0, status: 'fulfilled', fulfilledDate: '2026-04-10' },
  { id: 4, studentName: 'Sneha Patel', smartId: 'STU104', promisedAmount: 120000, expectedDate: '2026-04-30', daysUntilDue: 19, timesChanged: 2, status: 'pending' },
  { id: 5, studentName: 'Vikas Sharma', smartId: 'STU105', promisedAmount: 80000, expectedDate: '2026-04-12', daysUntilDue: -3, timesChanged: 3, status: 'overdue' },
];

export type AdminSubscriptionsDeposit = {
  id: number;
  studentName: string;
  smartId: string;
  depositAmount: number;
  collectedBy: string;
  collectedDate: string;
  deductionAmount: number;
  deductionReason?: string;
  refundAmount?: number;
  status: AdminSubscriptionsDepositStatus;
  refundedDate?: string;
};

export const ADMIN_SUBSCRIPTIONS_DEMO_SECURITY_DEPOSITS: readonly AdminSubscriptionsDeposit[] = [
  { id: 1, studentName: 'Rahul Kumar', smartId: 'STU101', depositAmount: 1000000, collectedBy: 'Admin', collectedDate: '2026-03-15', deductionAmount: 0, status: 'held' },
  { id: 2, studentName: 'Priya Singh', smartId: 'STU102', depositAmount: 800000, collectedBy: 'Manager', collectedDate: '2026-03-20', deductionAmount: 150000, deductionReason: 'Damaged property', status: 'held' },
  { id: 3, studentName: 'Aman Verma', smartId: 'STU103', depositAmount: 1200000, collectedBy: 'Admin', collectedDate: '2026-02-10', deductionAmount: 0, status: 'refunded', refundedDate: '2026-04-08' },
  { id: 4, studentName: 'Sneha Patel', smartId: 'STU104', depositAmount: 900000, collectedBy: 'Admin', collectedDate: '2026-03-05', deductionAmount: 900000, deductionReason: 'Multiple violations', status: 'forfeited' },
  { id: 5, studentName: 'Vikas Sharma', smartId: 'STU105', depositAmount: 1100000, collectedBy: 'Manager', collectedDate: '2026-04-01', deductionAmount: 0, status: 'held' },
];

export type AdminSubscriptionsAutoSuspendConfig = { daysBeforeSuspend: number; currentlySuspended: number; autoRestoredThisMonth: number; manualRestores: number };
export type AdminSubscriptionsSuspendedStudent = { id: number; studentId: number; studentName: string; smartId: string; seat: string; shift: string; daysOverdue: number; suspendedSince: string };
export const ADMIN_SUBSCRIPTIONS_DEMO_AUTO_SUSPEND_CONFIG: AdminSubscriptionsAutoSuspendConfig = { daysBeforeSuspend: 7, currentlySuspended: 4, autoRestoredThisMonth: 2, manualRestores: 1 };
export const ADMIN_SUBSCRIPTIONS_DEMO_SUSPENDED_STUDENTS: readonly AdminSubscriptionsSuspendedStudent[] = [
  { id: 1, studentId: 101, studentName: 'Rahul Kumar', smartId: 'STU101', seat: 'A-12', shift: 'Morning', daysOverdue: 14, suspendedSince: '2026-03-28' },
  { id: 2, studentId: 102, studentName: 'Priya Singh', smartId: 'STU102', seat: 'B-05', shift: 'Evening', daysOverdue: 9, suspendedSince: '2026-04-02' },
  { id: 3, studentId: 103, studentName: 'Aman Verma', smartId: 'STU103', seat: 'C-18', shift: 'Full Day', daysOverdue: 21, suspendedSince: '2026-03-21' },
  { id: 4, studentId: 104, studentName: 'Sneha Patel', smartId: 'STU104', seat: 'A-07', shift: 'Morning', daysOverdue: 8, suspendedSince: '2026-04-03' },
];

export type AdminSubscriptionsTrustScoreStudent = {
  rank: number;
  studentName: string;
  smartId: string;
  shift: AdminSubscriptionsTrustScoreStudentShift;
  trustScore: number;
  totalPromises: number;
  timesChanged: number;
  fulfilledCount: number;
  badge: AdminSubscriptionsTrustScoreStudentBadge;
};
export const ADMIN_SUBSCRIPTIONS_DEMO_TRUST_SCORE_STUDENTS: readonly AdminSubscriptionsTrustScoreStudent[] = [
  { rank: 1, studentName: 'Rahul Kumar', smartId: 'STU101', shift: 'Morning', trustScore: 92, totalPromises: 12, timesChanged: 0, fulfilledCount: 12, badge: 'reliable' },
  { rank: 2, studentName: 'Priya Singh', smartId: 'STU102', shift: 'Evening', trustScore: 85, totalPromises: 9, timesChanged: 1, fulfilledCount: 8, badge: 'reliable' },
  { rank: 3, studentName: 'Aman Verma', smartId: 'STU103', shift: 'Full Day', trustScore: 67, totalPromises: 15, timesChanged: 3, fulfilledCount: 9, badge: 'moderate' },
  { rank: 4, studentName: 'Sneha Patel', smartId: 'STU104', shift: 'Morning', trustScore: 45, totalPromises: 8, timesChanged: 4, fulfilledCount: 3, badge: 'low' },
  { rank: 5, studentName: 'Vikas Sharma', smartId: 'STU105', shift: 'Evening', trustScore: 78, totalPromises: 11, timesChanged: 2, fulfilledCount: 10, badge: 'moderate' },
  { rank: 6, studentName: 'Neha Gupta', smartId: 'STU106', shift: 'Full Day', trustScore: 33, totalPromises: 7, timesChanged: 5, fulfilledCount: 2, badge: 'low' },
];

/**
 * Explicitly demo-only subscription rows. Monetary fields use integer minor units,
 * matching the Finance formatting utility; these fixtures are never live API data.
 */
function getSubscriptionLifecycle(endDate: string, originalStatus: AdminSubscriptionsDemoSubscription['status'], referenceDate = new Date()): { daysLeft: number; status: AdminSubscriptionsDemoSubscription['status'] } {
  const fallbackStatus = originalStatus === 'suspended' || originalStatus === 'cancelled' ? originalStatus : 'expired';
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(endDate);
  const yearText = dateMatch?.[1];
  const monthText = dateMatch?.[2];
  const dayText = dateMatch?.[3];
  if (!yearText || !monthText || !dayText) return { daysLeft: 0, status: fallbackStatus };

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const expiry = new Date(Date.UTC(year, month - 1, day));
  const today = new Date(Date.UTC(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate()));
  const valid = Number.isFinite(expiry.getTime()) && expiry.getUTCFullYear() === year && expiry.getUTCMonth() === month - 1 && expiry.getUTCDate() === day;
  if (!valid) return { daysLeft: 0, status: fallbackStatus };
  const daysLeft = Math.round((expiry.getTime() - today.getTime()) / 86_400_000);
  const status = originalStatus === 'suspended' || originalStatus === 'cancelled' ? originalStatus : (daysLeft >= 0 ? 'active' : 'expired');
  return { daysLeft, status };
}

export const ADMIN_SUBSCRIPTIONS_DEMO_SUBSCRIPTIONS: readonly AdminSubscriptionsDemoSubscription[] = ([
  { id: 1, studentName: 'Aarav Sharma', smartId: 'STU001', plan: 'Premium Plan', shift: 'Morning', startDate: '2026-01-01', endDate: '2026-06-30', daysLeft: 12, base: 1_500_000, discount: 0, total: 1_500_000, paid: 1_500_000, due: 0, status: 'active' },
  { id: 2, studentName: 'Priya Patel', smartId: 'STU002', plan: 'Basic Plan', shift: 'Evening', startDate: '2025-11-01', endDate: '2026-04-30', daysLeft: 3, base: 800_000, discount: 20_000, total: 780_000, paid: 600_000, due: 180_000, status: 'active' },
  { id: 3, studentName: 'Rohan Kumar', smartId: 'STU003', plan: 'Premium Plan', shift: 'Full Day', startDate: '2025-08-01', endDate: '2025-12-31', daysLeft: -15, base: 1_800_000, discount: 0, total: 1_800_000, paid: 1_800_000, due: 0, status: 'expired' },
  { id: 4, studentName: 'Sneha Singh', smartId: 'STU004', plan: 'Basic Plan', shift: 'Morning', startDate: '2026-02-01', endDate: '2026-07-31', daysLeft: 45, base: 900_000, discount: 0, total: 900_000, paid: 450_000, due: 450_000, status: 'suspended' },
  { id: 5, studentName: 'Vikram Rao', smartId: 'STU005', plan: 'Premium Plan', shift: 'Evening', startDate: '2025-10-01', endDate: '2025-12-31', daysLeft: -45, base: 1_600_000, discount: 50_000, total: 1_550_000, paid: 1_550_000, due: 0, status: 'cancelled' },
  { id: 6, studentName: 'Ananya Gupta', smartId: 'STU006', plan: 'Basic Plan', shift: 'Full Day', startDate: '2026-03-01', endDate: '2026-08-31', daysLeft: 8, base: 750_000, discount: 0, total: 750_000, paid: 750_000, due: 0, status: 'active' },
  { id: 7, studentName: 'Karan Mehta', smartId: 'STU007', plan: 'Premium Plan', shift: 'Morning', startDate: '2025-09-01', endDate: '2026-02-28', daysLeft: -5, base: 1_400_000, discount: 0, total: 1_400_000, paid: 1_000_000, due: 400_000, status: 'expired' },
] as const).map((subscription) => ({ ...subscription, ...getSubscriptionLifecycle(subscription.endDate, subscription.status) }));

/** Demo-only Finance dashboard fixture values; not live API responses. */
export interface AdminSubscriptionsDemoDashboardStats {
  totalCollections: number; collectionsGrowth: number; activeStudents: number;
  expiringSoon: number; suspended: number; totalReferrals: number;
  depositsHeld: number; pendingPromises: number; overdueStudents: number;
  pendingRefunds: number; renewalsDue: number; lateFeeAccrued: number;
}
export interface AdminSubscriptionsDemoRecentPayment {
  id: number; studentName: string; studentSmartId: string;
  amount: number; mode: string; date: string;
}

export const ADMIN_SUBSCRIPTIONS_DEMO_DASHBOARD_STATS: AdminSubscriptionsDemoDashboardStats = {
  totalCollections: 4.488e+06, collectionsGrowth: 12.5, activeStudents: 12,
  expiringSoon: 3, suspended: 2, totalReferrals: 6, depositsHeld: 1.6e+06,
  pendingPromises: 2, overdueStudents: 3, pendingRefunds: 18, renewalsDue: 4, lateFeeAccrued: 150000,
};
export const ADMIN_SUBSCRIPTIONS_DEMO_RECENT_PAYMENTS: AdminSubscriptionsDemoRecentPayment[] = [
  { id: 1, studentName: 'Aarav Sharma',  studentSmartId: 'STU001', amount: 149900, mode: 'cash', date: '2026-04-01' },
  { id: 2, studentName: 'Priya Patel',   studentSmartId: 'STU002', amount: 104900, mode: 'upi',  date: '2026-04-02' },
  { id: 3, studentName: 'Ananya Singh',  studentSmartId: 'STU004', amount: 149900, mode: 'bank', date: '2026-04-05' },
  { id: 4, studentName: 'Vikram Rao',    studentSmartId: 'STU005', amount: 114900, mode: 'cash', date: '2026-04-06' },
  { id: 5, studentName: 'Sneha Gupta',   studentSmartId: 'STU006', amount: 219900, mode: 'upi',  date: '2026-04-08' },
];

/** Demo-only invoice records; never use as live invoice data. */
export const ADMIN_SUBSCRIPTIONS_DEMO_INVOICES = [
  { id: '1', invoiceNumber: 'INV-20260411-001', studentName: 'Gajodhar Prasad', studentId: 'STU-001234', phone: '9876543210', invoiceDate: '2026-04-11T00:00:00Z', grandTotal: 171600, paymentStatus: 'paid',    paymentMode: 'UPI',          planName: 'Annual Library Membership',       shift: 'Evening', seat: 'B-05' },
  { id: '2', invoiceNumber: 'INV-20260410-002', studentName: 'Aravind Sharma',  studentId: 'STU-002567', phone: '8765432109', invoiceDate: '2026-04-10T00:00:00Z', grandTotal: 120000, paymentStatus: 'paid',    paymentMode: 'Cash',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'A-01' },
  { id: '3', invoiceNumber: 'INV-20260409-003', studentName: 'Priya Nair',      studentId: 'STU-003891', phone: '7654321098', invoiceDate: '2026-04-09T00:00:00Z', grandTotal: 240000, paymentStatus: 'pending', paymentMode: 'Bank Transfer', planName: 'Quarterly Premium Plan',          shift: 'Full Day','seat': 'A-05' },
  { id: '4', invoiceNumber: 'INV-20260408-004', studentName: 'Rohan Khanna',    studentId: 'STU-004312', phone: '6543210987', invoiceDate: '2026-04-08T00:00:00Z', grandTotal: 90000,  paymentStatus: 'paid',    paymentMode: 'Card',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'D-10' },
  { id: '5', invoiceNumber: 'INV-20260407-005', studentName: 'Sara Mishra',     studentId: 'STU-005678', phone: '5432109876', invoiceDate: '2026-04-07T00:00:00Z', grandTotal: 150000, paymentStatus: 'overdue', paymentMode: '',             planName: 'Half-Yearly Plan',                shift: 'Night',   seat: 'C-12' },
];
export type AdminSubscriptionsDemoInvoice = typeof ADMIN_SUBSCRIPTIONS_DEMO_INVOICES[number];


export type AdminSubscriptionsDemoInvoiceDetail = AdminSubscriptionsDemoInvoice & {
  libraryName: string;
  libraryAddress: string;
  libraryGstin: string;
  libraryPhone: string;
  studentSmartId: string;
  studentPhone: string;
  studentAddress: string;
  paymentDate: string;
  items: { description: string; hsnCode: string; duration: string; amount: number; gstPercent: number; gstAmount: number }[];
  subtotal: number;
  totalGst: number;
  paymentTransactionId: string;
};

/** Detail preview extends the first list record so the list route ID and detail route ID cannot drift. */
const primaryDemoInvoice = ADMIN_SUBSCRIPTIONS_DEMO_INVOICES[0]!;
export const ADMIN_SUBSCRIPTIONS_DEMO_INVOICE_DETAIL: AdminSubscriptionsDemoInvoiceDetail = {
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

/** Demo-only receipt preview records; these are not proof of recorded payments. */
export const ADMIN_SUBSCRIPTIONS_DEMO_RECEIPTS = [
  { id: 'SL360-TRX-99421-X', receiptNumber: 'REC-20260411-001', studentName: 'Aravind Sharma',  studentId: 'LIB-2024-883', phone: '9876543210', date: '2024-10-24T00:00:00Z', amount: 124900, paymentMode: 'UPI',          planName: 'Premium Reading Zone (Monthly)',  shift: 'Morning', seat: 'A-01' },
  { id: 'SL360-TRX-88310-Y', receiptNumber: 'REC-20260410-002', studentName: 'Gajodhar Prasad', studentId: 'STU-001234',   phone: '8765432109', date: '2026-04-10T00:00:00Z', amount: 171600, paymentMode: 'UPI',          planName: 'Annual Library Membership',       shift: 'Evening', seat: 'B-05' },
  { id: 'SL360-TRX-77203-Z', receiptNumber: 'REC-20260409-003', studentName: 'Sara Mishra',     studentId: 'STU-008821',   phone: '7654321098', date: '2024-10-10T00:00:00Z', amount: 975000, paymentMode: 'Bank Transfer', planName: 'Security Deposit Refund',         shift: 'Night',   seat: 'C-12' },
  { id: 'SL360-TRX-66192-A', receiptNumber: 'REC-20260408-004', studentName: 'Rohan Khanna',    studentId: 'STU-007654',   phone: '6543210987', date: '2026-04-08T00:00:00Z', amount: 90000,  paymentMode: 'Cash',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'D-10' },
  { id: 'SL360-TRX-55081-B', receiptNumber: 'REC-20260407-005', studentName: 'Priya Nair',      studentId: 'STU-003891',   phone: '5432109876', date: '2026-04-07T00:00:00Z', amount: 240000, paymentMode: 'Card',         planName: 'Quarterly Premium Plan',          shift: 'Full Day','seat': 'A-05' },
];
export type AdminSubscriptionsDemoReceipt = typeof ADMIN_SUBSCRIPTIONS_DEMO_RECEIPTS[number];


export type AdminSubscriptionsDemoReceiptDetail = AdminSubscriptionsDemoReceipt & {
  receiptNo: string;
  plan: string;
  items: { label: string; amount: number }[];
  total: number;
  txnId: string;
};

/** Detail preview is derived from the first list record so the visible list action reaches this fixture. */
const primaryDemoReceipt = ADMIN_SUBSCRIPTIONS_DEMO_RECEIPTS[0]!;
export const ADMIN_SUBSCRIPTIONS_DEMO_RECEIPT_DETAIL: AdminSubscriptionsDemoReceiptDetail = {
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

/** Demo-only late-fee policy and overdue student fixtures. */
export type AdminSubscriptionsLateFeeConfig = { gracePeriodDays: number; penaltyPerDay: number };
export type AdminSubscriptionsDemoOverdueStudent = {
  studentId: string;
  studentName: string;
  smartId: string;
  phone: string;
  dueDate: string;
  daysOverdue: number;
  accruedFee: number;
  totalDue: number;
};

export const ADMIN_SUBSCRIPTIONS_DEMO_LATE_FEE_CONFIG: AdminSubscriptionsLateFeeConfig = { gracePeriodDays: 5, penaltyPerDay: 5000 };
export const ADMIN_SUBSCRIPTIONS_DEMO_OVERDUE_STUDENTS: AdminSubscriptionsDemoOverdueStudent[] = [
  { studentId: 'STU101', studentName: 'Rahul Kumar', smartId: 'STU101', phone: '8084350824', dueDate: '2026-04-05', daysOverdue: 6,  accruedFee: 30000, totalDue: 4.53e+06 },
  { studentId: 'STU102', studentName: 'Priya Singh', smartId: 'STU102', phone: '8084350824', dueDate: '2026-04-01', daysOverdue: 10, accruedFee: 50000, totalDue: 3.05e+06 },
  { studentId: 'STU103', studentName: 'Aman Verma',  smartId: 'STU103', phone: '8084350824', dueDate: '2026-03-28', daysOverdue: 14, accruedFee: 70000, totalDue: 6.07e+06 },
];

/** Demo-only referral leaderboard fixture rows. */
export type AdminSubscriptionsDemoReferrer = {
  id: number;
  name: string;
  smartId: string;
  referredNames: string[];
  bonusEarned: number;
  redeemed: number;
  balance: number;
};

export const ADMIN_SUBSCRIPTIONS_DEMO_REFERRERS: AdminSubscriptionsDemoReferrer[] = [
  { id: 1, name: 'Rahul Kumar',  smartId: 'STU101', referredNames: ['Priya S', 'Aman V', 'Sneha P', 'Vikas S', 'Neha G'], bonusEarned: 50000, redeemed: 30000, balance: 20000 },
  { id: 2, name: 'Priya Singh',  smartId: 'STU102', referredNames: ['Aman V', 'Rohan M'], bonusEarned: 20000, redeemed: 20000, balance: 0 },
  { id: 3, name: 'Aman Verma',   smartId: 'STU103', referredNames: ['Sneha P', 'Vikas S'], bonusEarned: 20000, redeemed: 0,   balance: 20000 },
  { id: 4, name: 'Sneha Patel',  smartId: 'STU104', referredNames: ['Neha G', 'Rohan M', 'Kiran D'], bonusEarned: 30000, redeemed: 10000, balance: 20000 },
  { id: 5, name: 'Vikas Sharma', smartId: 'STU105', referredNames: ['Kiran D'], bonusEarned: 10000, redeemed: 0,   balance: 10000 },
  { id: 6, name: 'Neha Gupta',   smartId: 'STU106', referredNames: ['Rohan M'], bonusEarned: 10000, redeemed: 0,   balance: 10000 },
];
