// RESPONSIBILITY: Define local sample fixtures for billing overview; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_overview/mocks/fixtures/SuperadminBillingOverviewSampleMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/types/SuperadminBillingOverviewTypes';

/** Synthetic data for UI preview only. Never represents real customers, tax IDs, or transactions. */
export const SUPERADMIN_BILLING_SAMPLE_INVOICES: SuperadminBillingInvoiceSample[] = [
  { id: 'SAMPLE-REC-001', tenant: 'Sample Tenant A', date: '10 Apr, 2026', amount: 2999, status: 'Paid', method: 'UPI', gst: 'SAMPLE-GST-NOT-REAL' },
  { id: 'SAMPLE-REC-002', tenant: 'Sample Tenant B', date: '01 Apr, 2026', amount: 999, status: 'Overdue', method: '—', gst: 'SAMPLE-GST-NOT-REAL' },
  { id: 'SAMPLE-REC-003', tenant: 'Sample Tenant C', date: '28 Mar, 2026', amount: 999, status: 'Paid', method: 'Card', gst: 'SAMPLE-GST-NOT-REAL' },
];


/** Illustrative dashboard KPI values stored in integer minor units. */
export const SUPERADMIN_BILLING_SAMPLE_OVERVIEW_KPIS = Object.freeze({
  lifetimeCollectionsMinor: 84529000,
  overduePaymentsMinor: 1249900,
  nextPayoutMinor: 4500000,
  currencyCode: 'INR',
});
