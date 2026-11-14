// FLOW: Feature consumers -> superadmin_billing/billing_member_security_deposits/constants/SuperadminBillingOverviewMemberSecurityDepositsSecurityDepositConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Finance Security Deposit Constants; centralizes stable module-owned options and configuration. */
import type { SuperadminFinanceSecurityDepositStatus } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/types/SuperadminBillingOverviewMemberSecurityDepositsSecurityDepositTypes';

export const SUPERADMIN_FINANCE_SECURITY_DEPOSIT_STATUS_BADGE: Record<SuperadminFinanceSecurityDepositStatus, string> = {
  held: 'fin-badge fin-badge--info',
  refunded: 'fin-badge fin-badge--success',
  forfeited: 'fin-badge fin-badge--danger',
};
