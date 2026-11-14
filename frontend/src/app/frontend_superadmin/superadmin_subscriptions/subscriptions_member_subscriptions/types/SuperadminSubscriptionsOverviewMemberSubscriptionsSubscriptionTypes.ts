// FLOW: Feature source -> superadmin_subscriptions/subscriptions_member_subscriptions/types/SuperadminSubscriptionsOverviewMemberSubscriptionsSubscriptionTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Finance Subscription Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminFinanceSubscriptionStatus = 'active' | 'expired' | 'suspended' | 'cancelled';

/**
 * Defines the public SuperadminFinanceSubscriptionSample contract for subscriptions overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: number.
 * @property studentName Display label for the owning feature. Declared type: string.
 * @property smartId Stable identifier for the associated record. Declared type: string.
 * @property plan Value defined by the existing feature-local contract. Declared type: 'Basic Plan' | 'Premium Plan'.
 * @property shift Value defined by the existing feature-local contract. Declared type: 'Morning' | 'Evening' | 'Full Day'.
 * @property startDate Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property endDate Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property daysLeft Value defined by the existing feature-local contract. Declared type: number.
 * @property base Value defined by the existing feature-local contract. Declared type: number.
 * @property discount Value defined by the existing feature-local contract. Declared type: number.
 * @property total Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property paid Stable identifier for the associated record. Declared type: number.
 * @property due Value defined by the existing feature-local contract. Declared type: number.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminFinanceSubscriptionStatus.
 */
export interface SuperadminFinanceSubscriptionSample {
  id: number;
  studentName: string;
  smartId: string;
  plan: 'Basic Plan' | 'Premium Plan';
  shift: 'Morning' | 'Evening' | 'Full Day';
  startDate: string;
  endDate: string;
  daysLeft: number;
  base: number;
  discount: number;
  total: number;
  paid: number;
  due: number;
  status: SuperadminFinanceSubscriptionStatus;
}
