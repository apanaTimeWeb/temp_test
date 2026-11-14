// RESPONSIBILITY: Define local sample fixtures for billing member finance overview; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_member_finance_overview/mocks/fixtures/SuperadminBillingOverviewMemberFinanceOverviewMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { DashboardStats, RecentPayment } from '@/app/frontend_superadmin/superadmin_billing/billing_member_finance_overview/types/SuperadminBillingOverviewMemberFinanceOverviewPageClientComponentTypes';

/** Sample KPI values for the explicitly local member-finance preview; not live billing data. */
export const SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_MOCK_STATS: DashboardStats = {
  totalCollections: 44880, collectionsGrowth: 12.5, activeStudents: 12,
  expiringSoon: 3, suspended: 2, totalReferrals: 6, depositsHeld: 16000,
  pendingPromises: 2, overdueStudents: 3, pendingRefunds: 18, renewalsDue: 4, lateFeeAccrued: 1500,
};

/** Sample recent-payment rows for the explicitly local member-finance preview. */
export const SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_MOCK_RECENT_PAYMENTS: RecentPayment[] = [
  { id: 1, studentName: 'Aarav Sharma', studentSmartId: 'STU001', amount: 1499, mode: 'cash', date: '2026-04-01' },
  { id: 2, studentName: 'Priya Patel', studentSmartId: 'STU002', amount: 1049, mode: 'upi', date: '2026-04-02' },
  { id: 3, studentName: 'Ananya Singh', studentSmartId: 'STU004', amount: 1499, mode: 'bank', date: '2026-04-05' },
  { id: 4, studentName: 'Vikram Rao', studentSmartId: 'STU005', amount: 1149, mode: 'cash', date: '2026-04-06' },
  { id: 5, studentName: 'Sneha Gupta', studentSmartId: 'STU006', amount: 2199, mode: 'upi', date: '2026-04-08' },
];
