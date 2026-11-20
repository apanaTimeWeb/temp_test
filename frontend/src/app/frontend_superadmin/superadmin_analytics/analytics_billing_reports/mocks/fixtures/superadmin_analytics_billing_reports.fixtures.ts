// mocks/fixtures/superadmin_analytics_billing_reports.fixtures.ts
// Fixtures with 3-tier scale support for Superadmin Billing Reports

import type { BillingReportsOverviewData, BillingReportTableRecord } from '../../types/SuperadminAnalyticsBillingReportsTypes';

const PLANS = ['Starter Plan', 'Professional Plan', 'Enterprise Elite', 'Multi-Branch Pro'];
const CYCLES = ['MONTHLY', 'QUARTERLY', 'YEARLY'] as const;
const STATUSES = ['PAID', 'PAID', 'PAID', 'PENDING', 'OVERDUE', 'FAILED', 'REFUNDED'] as const;
const METHODS = ['RAZORPAY_UPI', 'STRIPE_CARD', 'NET_BANKING', 'OFFLINE_BANK_TRANSFER'];

export function generateBillingReportMockRecords(count: number): BillingReportTableRecord[] {
  return Array.from({ length: count }, (_, idx) => {
    const idNum = idx + 1;
    const plan = PLANS[idx % PLANS.length];
    const amountMinor = plan === 'Starter Plan' ? 299900 : plan === 'Professional Plan' ? 599900 : plan === 'Enterprise Elite' ? 1499900 : 2499900;
    const status = STATUSES[idx % STATUSES.length];

    return {
      id: `inv-rec-${idNum.toString().padStart(4, '0')}`,
      invoiceNumber: `INV-2026-${(10000 + idNum).toString()}`,
      libraryName: `Apex Central Library #${(idx % 12) + 1}`,
      branchName: `Branch ${(idx % 5) + 1}`,
      planName: plan,
      billingCycle: CYCLES[idx % CYCLES.length],
      amountMinor,
      taxMinor: Math.round(amountMinor * 0.18),
      paymentStatus: status,
      paymentMethod: METHODS[idx % METHODS.length],
      transactionId: `txn_live_${(8800000 + idNum).toString()}`,
      invoiceDate: `2026-11-0${(idx % 9) + 1}`,
      dueDate: `2026-11-1${(idx % 9) + 1}`,
      paidAt: status === 'PAID' ? '2026-11-05 14:32:00' : null,
    };
  });
}

export const MOCK_BILLING_TIER_1_RECORDS = generateBillingReportMockRecords(10);
export const MOCK_BILLING_TIER_2_RECORDS = generateBillingReportMockRecords(100);
export const MOCK_BILLING_TIER_3_RECORDS = generateBillingReportMockRecords(500);

export const MOCK_BILLING_REPORTS_OVERVIEW: BillingReportsOverviewData = {
  kpis: {
    totalRevenueMinor: 845000000, // ₹84,50,000
    mrrMinor: 184000000,          // ₹18,40,000
    yrrMinor: 2208000000,         // ₹2,20,80,000
    pendingInvoicesCount: 34,
    pendingAmountMinor: 48000000,  // ₹4,80,000
    failedPaymentsCount: 8,
    failedAmountMinor: 9500000,    // ₹95,000
    refundsCount: 3,
    refundAmountMinor: 3200000,    // ₹32,000
    planWiseIncome: [
      { planName: 'Enterprise Elite', revenueMinor: 385000000, subscriberCount: 256, percentage: 45.5 },
      { planName: 'Professional Plan', revenueMinor: 265000000, subscriberCount: 442, percentage: 31.4 },
      { planName: 'Multi-Branch Pro', revenueMinor: 125000000, subscriberCount: 84, percentage: 14.8 },
      { planName: 'Starter Plan', revenueMinor: 70000000, subscriberCount: 466, percentage: 8.3 },
    ],
  },
  revenueTrend: [
    { period: 'Jun 2026', collectedMinor: 125000000, pendingMinor: 15000000 },
    { period: 'Jul 2026', collectedMinor: 142000000, pendingMinor: 18000000 },
    { period: 'Aug 2026', collectedMinor: 158000000, pendingMinor: 12000000 },
    { period: 'Sep 2026', collectedMinor: 169000000, pendingMinor: 22000000 },
    { period: 'Oct 2026', collectedMinor: 178000000, pendingMinor: 35000000 },
    { period: 'Nov 2026', collectedMinor: 184000000, pendingMinor: 48000000 },
  ],
  items: MOCK_BILLING_TIER_1_RECORDS,
  totalCount: 1248,
  filterOptions: {
    libraries: [
      { id: 'lib-01', name: 'Apex Central Library' },
      { id: 'lib-02', name: 'National Digital Archive' },
      { id: 'lib-03', name: 'City Central Reading Hall' },
    ],
    branches: [
      { id: 'br-01', name: 'Main Campus Branch' },
      { id: 'br-02', name: 'Downtown Study Center' },
    ],
    plans: ['Starter Plan', 'Professional Plan', 'Enterprise Elite', 'Multi-Branch Pro'],
    paymentStatuses: ['PAID', 'PENDING', 'FAILED', 'REFUNDED', 'OVERDUE'],
    admins: [
      { id: 'adm-01', name: 'Dr. Rohit Sharma' },
      { id: 'adm-02', name: 'Priya Verma' },
    ],
  },
};
