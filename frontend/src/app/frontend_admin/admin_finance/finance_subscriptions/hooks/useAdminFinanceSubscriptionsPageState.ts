// DATA FLOW: finance_subscriptions route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';
import { useMemo } from 'react';
import { ADMIN_SUBSCRIPTIONS_DEMO_SUBSCRIPTIONS } from '@/app/frontend_admin/admin_finance/finance_subscriptions/mocks/AdminFinanceSubscriptionsDemoFixtures';
import type { AdminSubscriptionsDemoSubscription, AdminSubscriptionsPlanFilter, AdminSubscriptionsShiftFilter, AdminSubscriptionsStatusFilter } from '@/app/frontend_admin/admin_finance/finance_subscriptions/types/AdminFinanceSubscriptionsTypes';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

/** URL-backed, shareable filters; visible rows are derived and never copied into duplicate state. */
export function useAdminSubscriptionsPageState(isDemoMode: boolean) {
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<AdminSubscriptionsStatusFilter>('status', 'all', { validValues: ['all', 'active', 'expired', 'suspended', 'cancelled'] });
  const [planFilter, setPlanFilter] = useAdminApplicationInfrastructureUrlQueryState<AdminSubscriptionsPlanFilter>('plan', 'all', { validValues: ['all', 'Basic Plan', 'Premium Plan'] });
  const [shiftFilter, setShiftFilter] = useAdminApplicationInfrastructureUrlQueryState<AdminSubscriptionsShiftFilter>('shift', 'all', { validValues: ['all', 'Morning', 'Evening', 'Full Day'] });
  const rows = useMemo<AdminSubscriptionsDemoSubscription[]>(() => {
    if (!isDemoMode) return [];
    return ADMIN_SUBSCRIPTIONS_DEMO_SUBSCRIPTIONS.filter((subscription) =>
      (statusFilter === 'all' || subscription.status === statusFilter)
      && (planFilter === 'all' || subscription.plan === planFilter)
      && (shiftFilter === 'all' || subscription.shift === shiftFilter),
    );
  }, [isDemoMode, statusFilter, planFilter, shiftFilter]);
  return { statusFilter, setStatusFilter, planFilter, setPlanFilter, shiftFilter, setShiftFilter, rows };
}
