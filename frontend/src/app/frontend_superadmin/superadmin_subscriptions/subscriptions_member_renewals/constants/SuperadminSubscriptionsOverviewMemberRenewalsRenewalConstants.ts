// RESPONSIBILITY: Define stable module-owned constants for subscriptions member renewals; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_subscriptions/subscriptions_member_renewals/constants/SuperadminSubscriptionsOverviewMemberRenewalsRenewalConstants.ts -> typed constants -> component/hook/config behavior.


/** Stable module-owned options/configuration; user-visible labels must be resolved through locale keys in the consumer. */
export const SUPERADMIN_FINANCE_RENEWAL_PLANS = [
  { id: 1, name: 'Basic',   price: 999  },
  { id: 2, name: 'Premium', price: 1499 },
  { id: 3, name: 'Elite',   price: 2499 },
];


/** Stable module-owned options/configuration; user-visible labels must be resolved through locale keys in the consumer. */
export const SUPERADMIN_FINANCE_RENEWAL_FILTERS = [
  { labelKey: 'COPY.EXPIRED',             value: 'expired',     emoji: '🔴' },
  { labelKey: 'COPY.EXPIRING_IN_7_DAYS',  value: 'expiring_7',  emoji: '🟠' },
  { labelKey: 'COPY.EXPIRING_IN_15_DAYS', value: 'expiring_15', emoji: '🟡' },
] as const;
