// FLOW: Feature source -> superadmin_subscriptions/subscriptions_overview/types/SuperadminSubscriptionsOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Subscriptions Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminSubscriptionPaymentStatus = 'Paid' | 'Due Soon' | 'Overdue';

/**
 * Defines the public SuperadminSubscriptionRecord contract for subscriptions overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property tenant Value defined by the existing feature-local contract. Declared type: string.
 * @property plan Value defined by the existing feature-local contract. Declared type: string.
 * @property cycle Value defined by the existing feature-local contract. Declared type: 'Monthly' | 'Yearly'.
 * @property mrr Value defined by the existing feature-local contract. Declared type: number.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminSubscriptionPaymentStatus.
 */
export interface SuperadminSubscriptionRecord {
  id: string;
  tenant: string;
  plan: string;
  cycle: 'Monthly' | 'Yearly';
  mrr: number;
  status: SuperadminSubscriptionPaymentStatus;
}
