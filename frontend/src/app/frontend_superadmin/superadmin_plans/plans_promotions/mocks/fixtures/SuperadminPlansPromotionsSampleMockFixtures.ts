// RESPONSIBILITY: Define local sample fixtures for plans promotions; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_plans/plans_promotions/mocks/fixtures/SuperadminPlansPromotionsSampleMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminBillingInvoiceSample, SuperadminBillingPromoSample } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes';

/** Synthetic data for UI preview only. Never represents real customers, tax IDs, or transactions. */
export const SUPERADMIN_BILLING_SAMPLE_INVOICES: SuperadminBillingInvoiceSample[] = [
  { id: 'SAMPLE-REC-001', tenant: 'Sample Tenant A', date: '10 Apr, 2026', amount: 2999, status: 'Paid', method: 'UPI', gst: 'SAMPLE-GST-NOT-REAL' },
  { id: 'SAMPLE-REC-002', tenant: 'Sample Tenant B', date: '01 Apr, 2026', amount: 999, status: 'Overdue', method: '—', gst: 'SAMPLE-GST-NOT-REAL' },
  { id: 'SAMPLE-REC-003', tenant: 'Sample Tenant C', date: '28 Mar, 2026', amount: 999, status: 'Paid', method: 'Card', gst: 'SAMPLE-GST-NOT-REAL' },
];

export const SUPERADMIN_BILLING_SAMPLE_PROMOS: SuperadminBillingPromoSample[] = [
  { id: 'sample-1', code: 'SAMPLE50', discount: '50%', expiry: '2026-11-01', uses: 124, maxUses: 500, status: 'Active' },
  { id: 'sample-2', code: 'SAMPLE20', discount: '20%', expiry: '2026-12-31', uses: 8, maxUses: 50, status: 'Active' },
  { id: 'sample-3', code: 'EXPIRED_SAMPLE', discount: '', discountAmountMinor: 99900, discountCurrencyCode: 'INR', expiry: '2025-12-31', uses: 150, maxUses: 150, status: 'Expired' },
];

/** Illustrative dashboard KPI values stored in integer minor units. */
export const SUPERADMIN_BILLING_SAMPLE_OVERVIEW_KPIS = Object.freeze({
  lifetimeCollectionsMinor: 84529000,
  overduePaymentsMinor: 1249900,
  nextPayoutMinor: 4500000,
  currencyCode: 'INR',
});
