// FLOW: Feature source -> superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Billing Types; defines module-owned type contracts for the named data boundary. */
export interface SuperadminBillingInvoiceSample {
  id: string;
  tenant: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Overdue';
  method: string;
  gst: string;
}

/**
 * Defines the public SuperadminBillingPromoSample contract for plans promotions. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property code Value defined by the existing feature-local contract. Declared type: string.
 * @property discount Value defined by the existing feature-local contract. Declared type: string.
 * @property discountAmountMinor Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property discountCurrencyCode Value defined by the existing feature-local contract. Declared type: string.
 * @property expiry Value defined by the existing feature-local contract. Declared type: string.
 * @property uses Value defined by the existing feature-local contract. Declared type: number.
 * @property maxUses Value defined by the existing feature-local contract. Declared type: number.
 * @property status Status value as represented by the existing feature contract. Declared type: 'Active' | 'Expired'.
 */
export interface SuperadminBillingPromoSample {
  id: string;
  code: string;
  discount: string;
  discountAmountMinor?: number;
  discountCurrencyCode?: string;
  expiry: string;
  uses: number;
  maxUses: number;
  status: 'Active' | 'Expired';
}
