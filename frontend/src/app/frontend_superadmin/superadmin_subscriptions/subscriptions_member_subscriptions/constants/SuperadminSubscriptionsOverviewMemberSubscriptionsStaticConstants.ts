// RESPONSIBILITY: Define stable module-owned constants for subscriptions member subscriptions; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_subscriptions/subscriptions_member_subscriptions/constants/SuperadminSubscriptionsOverviewMemberSubscriptionsStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminSubscriptionsOverviewMemberSubscriptionsPageClient.tsx. */
export const SUPERADMIN_FINANCE_SUBSCRIPTIONS_PAGE_CLIENT_STATUS_BADGE = {
  active:    'fin-badge fin-badge--success',
  expired:   'fin-badge fin-badge--danger',
  suspended: 'fin-badge fin-badge--warning',
  cancelled: 'fin-badge fin-badge--neutral',
};

/** Named visual urgency thresholds for the snapshot-relative days-left label. */
export const SUPERADMIN_FINANCE_SUBSCRIPTION_DAY_THRESHOLDS = Object.freeze({
  URGENT: 7,
  WARNING: 15,
});
