// FLOW: Feature source -> superadmin_subscriptions/subscriptions_overview/types/SuperadminSubscriptionsOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Subscriptions Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminSubscriptionPaymentStatus =
  | 'Paid'
  | 'Due Soon'
  | 'Overdue'
  | 'Active'
  | 'Trial'
  | 'Past Due'
  | 'Grace Period'
  | 'Suspended'
  | 'Cancelled'
  | 'Expired';

export interface SuperadminSubscriptionAuditEntry {
  id: string;
  date: string;
  action: string;
  note: string;
  actor: string;
}

/**
 * Defines the public SuperadminSubscriptionRecord contract for subscriptions overview.
 */
export interface SuperadminSubscriptionRecord {
  id: string;
  tenant: string;
  plan: string;
  cycle: 'Monthly' | 'Yearly';
  mrr: number;
  status: SuperadminSubscriptionPaymentStatus;
  startDate?: string;
  renewalDate?: string;
  gracePeriodDays?: number;
  autoRenewal?: boolean;
  discountPercent?: number;
  branchesCount?: number;
  adminContact?: string;
  email?: string;
  phone?: string;
  customPrice?: number;
  history?: SuperadminSubscriptionAuditEntry[];
}
