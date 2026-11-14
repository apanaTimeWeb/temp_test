// FLOW: Feature component -> superadmin_billing/billing_member_refunds/hooks/useSuperadminBillingOverviewMemberRefundsQueries.ts -> local state/typed dependencies -> returned state and actions.
'use client';
/** Responsibility: Member Refunds query state; owns only refund records. */
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_MEMBER_REFUNDS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/api/superadmin_billing_overview_member_refunds.query_keys';
import { fetchSuperadminBillingOverviewMemberRefunds } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/api/superadmin_billing_overview_member_refunds_read.api';

/**
 * Owns the billing overview member refunds query lifecycle for billing overview, keeping feature state and side effects within this leaf.
 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminBillingOverviewMemberRefundsQuery() {
  return useQuery({ queryKey: SUPERADMIN_MEMBER_REFUNDS_QUERY_KEYS.lists(), queryFn: fetchSuperadminBillingOverviewMemberRefunds });
}
