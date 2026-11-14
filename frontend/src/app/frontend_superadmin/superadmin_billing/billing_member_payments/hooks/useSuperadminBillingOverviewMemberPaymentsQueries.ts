// FLOW: Feature component -> superadmin_billing/billing_member_payments/hooks/useSuperadminBillingOverviewMemberPaymentsQueries.ts -> local state/typed dependencies -> returned state and actions.
'use client';
/** Responsibility: Member Payments query state; owns only payment records. */
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_MEMBER_PAYMENTS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/api/superadmin_billing_overview_member_payments.query_keys';
import { fetchSuperadminBillingOverviewMemberPayments } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/api/superadmin_billing_overview_member_payments_read.api';

/**
 * Owns the billing overview member payments query lifecycle for billing overview, keeping feature state and side effects within this leaf.
 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminBillingOverviewMemberPaymentsQuery() {
  return useQuery({ queryKey: SUPERADMIN_MEMBER_PAYMENTS_QUERY_KEYS.lists(), queryFn: fetchSuperadminBillingOverviewMemberPayments });
}
