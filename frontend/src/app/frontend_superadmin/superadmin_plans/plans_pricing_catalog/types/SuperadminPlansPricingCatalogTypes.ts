// FLOW: Feature source -> superadmin_plans/plans_pricing_catalog/types/SuperadminPlansPricingCatalogTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Subscriptions Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminSubscriptionPaymentStatus = 'Paid' | 'Due Soon' | 'Overdue';

/**
 * Defines the public SuperadminSubscriptionRecord contract for plans pricing catalog. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
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

/**
 * Defines the public SuperadminSubscriptionPlan contract for plans pricing catalog. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property name Display label for the owning feature. Declared type: string.
 * @property price Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property branches Value defined by the existing feature-local contract. Declared type: number.
 * @property members Value defined by the existing feature-local contract. Declared type: number.
 * @property storage Value defined by the existing feature-local contract. Declared type: string.
 * @property isPopular Boolean state used by the owning feature. Declared type: boolean.
 */
export interface SuperadminSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  branches: number;
  members: number;
  storage: string;
  isPopular: boolean;
}

/**
 * Defines the public SuperadminSubscriptionPlanFormValues contract for plans pricing catalog. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminSubscriptionPlanFormValues = Pick<SuperadminSubscriptionPlan, 'name' | 'price' | 'branches' | 'members' | 'storage'>;
