import type { AdminFinanceSubscriptionsScenario } from '@/app/frontend_admin/admin_finance/finance_subscriptions/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminSubscriptionsDemoSubscription = {
  id: number;
  studentName: string;
  smartId: string;
  plan: string;
  shift: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  base: number;
  discount: number;
  total: number;
  paid: number;
  due: number;
  status: AdminSubscriptionsDemoSubscriptionStatus;
};

export type AdminSubscriptionsStatusFilter = 'all' | AdminSubscriptionsDemoSubscription['status'];
export type AdminSubscriptionsPlanFilter = 'all' | string;
export type AdminSubscriptionsShiftFilter = 'all' | string;

export type AdminSubscriptionsDemoSubscriptionStatus = 'active' | 'expired' | 'suspended' | 'cancelled';

export interface AdminFinanceSubscriptionsHarnessProps {
  children: ReactNode;
  scenario?: AdminFinanceSubscriptionsScenario;
}

export type AdminSubscriptionsPromiseItemStatus = 'pending' | 'fulfilled' | 'overdue';
export type AdminSubscriptionsDepositStatus = 'held' | 'refunded' | 'forfeited';
export type AdminSubscriptionsTrustScoreStudentShift = 'Morning' | 'Evening' | 'Full Day';
export type AdminSubscriptionsTrustScoreStudentBadge = 'reliable' | 'moderate' | 'low';
