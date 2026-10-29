/**
 * Module-owned, sample-only repository implementation. Each exported collection/object is a defensive
 * snapshot of the authored fixture data; these values are not a persistence or API contract.
 */
import { MANAGER_FINANCE_SAMPLE_RECEIPTS as MANAGER_FINANCE_SAMPLE_RECEIPTSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_INVOICES as MANAGER_FINANCE_SAMPLE_INVOICESFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_REFERRERS as MANAGER_FINANCE_SAMPLE_REFERRERSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS as MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG as MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIGFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS as MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS as MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_RENEWALS as MANAGER_FINANCE_SAMPLE_RENEWALSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_PENDING_FINES as MANAGER_FINANCE_SAMPLE_PENDING_FINESFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY as MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORYFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS as MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsComponentSampleFixtures';
import type { ManagerFinanceReferralsLateFeeConfig as ManagerFinanceReferralsLateFeeConfigFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsOperationalSampleFixtures';
import type { ManagerFinanceReferralsOverdueStudent as ManagerFinanceReferralsOverdueStudentFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsOperationalSampleFixtures';
import type { ManagerFinanceReferralsSampleDeposit as ManagerFinanceReferralsSampleDepositFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsOperationalSampleFixtures';
import type { ManagerFinanceReferralsSampleDashboardStats as ManagerFinanceReferralsSampleDashboardStatsFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsOperationalSampleFixtures';
import type { ManagerFinanceReferralsSampleRecentPayment as ManagerFinanceReferralsSampleRecentPaymentFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsOperationalSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIG as MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIGFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsOperationalSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTS as MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsOperationalSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_DEPOSITS as MANAGER_FINANCE_SAMPLE_DEPOSITSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsOperationalSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_DASHBOARD_STATS as MANAGER_FINANCE_SAMPLE_DASHBOARD_STATSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsOperationalSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_RECENT_PAYMENTS as MANAGER_FINANCE_SAMPLE_RECENT_PAYMENTSFixture } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/manager_finance_referrals_fixtures/ManagerFinanceReferralsOperationalSampleFixtures';

export const MANAGER_FINANCE_SAMPLE_RECEIPTS = MANAGER_FINANCE_SAMPLE_RECEIPTSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_INVOICES = MANAGER_FINANCE_SAMPLE_INVOICESFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_REFERRERS = MANAGER_FINANCE_SAMPLE_REFERRERSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS = MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG = { ...MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIGFixture };
export const MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS = MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS = MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_RENEWALS = MANAGER_FINANCE_SAMPLE_RENEWALSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_PENDING_FINES = MANAGER_FINANCE_SAMPLE_PENDING_FINESFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY = MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORYFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS = { ...MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTSFixture };
export type ManagerFinanceReferralsLateFeeConfig = ManagerFinanceReferralsLateFeeConfigFixture;
export type ManagerFinanceReferralsOverdueStudent = ManagerFinanceReferralsOverdueStudentFixture;
export type ManagerFinanceReferralsSampleDeposit = ManagerFinanceReferralsSampleDepositFixture;
export type ManagerFinanceReferralsSampleDashboardStats = ManagerFinanceReferralsSampleDashboardStatsFixture;
export type ManagerFinanceReferralsSampleRecentPayment = ManagerFinanceReferralsSampleRecentPaymentFixture;
export const MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIG = { ...MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIGFixture };
export const MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTS = MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_DEPOSITS = MANAGER_FINANCE_SAMPLE_DEPOSITSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_DASHBOARD_STATS = { ...MANAGER_FINANCE_SAMPLE_DASHBOARD_STATSFixture };
export const MANAGER_FINANCE_SAMPLE_RECENT_PAYMENTS = MANAGER_FINANCE_SAMPLE_RECENT_PAYMENTSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
