// RESPONSIBILITY: Provide deterministic module-owned helper behavior for subscriptions member subscriptions; it does not own page routing or live backend persistence.
// FLOW: Feature caller -> superadmin_subscriptions/subscriptions_member_subscriptions/utils/SuperadminSubscriptionsOverviewMemberSubscriptionsSubscriptionUtilities.ts -> typed input/contract -> deterministic helper result.
import type { SuperadminFinanceSubscriptionSample } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/types/SuperadminSubscriptionsOverviewMemberSubscriptionsSubscriptionTypes';

/** Returns every unique plan represented by the source records, sorted for a stable filter UI. 
 * @param subscriptions - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function getSuperadminFinanceSubscriptionPlanOptions(
  subscriptions: readonly SuperadminFinanceSubscriptionSample[],
): string[] {
  return Array.from(new Set(subscriptions.map(subscription => subscription.plan))).sort((a, b) => a.localeCompare(b));
}
