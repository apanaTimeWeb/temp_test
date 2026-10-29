/**
 * Module-owned, sample-only repository implementation. Each exported collection/object is a defensive
 * snapshot of the authored fixture data; these values are not a persistence or API contract.
 */
import { MANAGER_FINANCE_SAMPLE_RECEIPTS as MANAGER_FINANCE_SAMPLE_RECEIPTSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_INVOICES as MANAGER_FINANCE_SAMPLE_INVOICESFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_REFERRERS as MANAGER_FINANCE_SAMPLE_REFERRERSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS as MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG as MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIGFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS as MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS as MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_RENEWALS as MANAGER_FINANCE_SAMPLE_RENEWALSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_PENDING_FINES as MANAGER_FINANCE_SAMPLE_PENDING_FINESFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY as MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORYFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS as MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsComponentSampleFixtures';
import type { ManagerFinanceSecurityDepositsLateFeeConfig as ManagerFinanceSecurityDepositsLateFeeConfigFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsOperationalSampleFixtures';
import type { ManagerFinanceSecurityDepositsOverdueStudent as ManagerFinanceSecurityDepositsOverdueStudentFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsOperationalSampleFixtures';
import type { ManagerFinanceSecurityDepositsSampleDeposit as ManagerFinanceSecurityDepositsSampleDepositFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsOperationalSampleFixtures';
import type { ManagerFinanceSecurityDepositsSampleDashboardStats as ManagerFinanceSecurityDepositsSampleDashboardStatsFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsOperationalSampleFixtures';
import type { ManagerFinanceSecurityDepositsSampleRecentPayment as ManagerFinanceSecurityDepositsSampleRecentPaymentFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsOperationalSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIG as MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIGFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsOperationalSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTS as MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsOperationalSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_DEPOSITS as MANAGER_FINANCE_SAMPLE_DEPOSITSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsOperationalSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_DASHBOARD_STATS as MANAGER_FINANCE_SAMPLE_DASHBOARD_STATSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsOperationalSampleFixtures';
import { MANAGER_FINANCE_SAMPLE_RECENT_PAYMENTS as MANAGER_FINANCE_SAMPLE_RECENT_PAYMENTSFixture } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsOperationalSampleFixtures';

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
export type ManagerFinanceSecurityDepositsLateFeeConfig = ManagerFinanceSecurityDepositsLateFeeConfigFixture;
export type ManagerFinanceSecurityDepositsOverdueStudent = ManagerFinanceSecurityDepositsOverdueStudentFixture;
export type ManagerFinanceSecurityDepositsSampleDeposit = ManagerFinanceSecurityDepositsSampleDepositFixture;
export type ManagerFinanceSecurityDepositsSampleDashboardStats = ManagerFinanceSecurityDepositsSampleDashboardStatsFixture;
export type ManagerFinanceSecurityDepositsSampleRecentPayment = ManagerFinanceSecurityDepositsSampleRecentPaymentFixture;
export const MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIG = { ...MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIGFixture };
export const MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTS = MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_DEPOSITS = MANAGER_FINANCE_SAMPLE_DEPOSITSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_FINANCE_SAMPLE_DASHBOARD_STATS = { ...MANAGER_FINANCE_SAMPLE_DASHBOARD_STATSFixture };
export const MANAGER_FINANCE_SAMPLE_RECENT_PAYMENTS = MANAGER_FINANCE_SAMPLE_RECENT_PAYMENTSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
