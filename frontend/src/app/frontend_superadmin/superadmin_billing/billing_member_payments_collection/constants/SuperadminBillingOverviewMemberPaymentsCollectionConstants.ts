// FLOW: Feature consumers -> superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Finance Constants; centralizes stable module-owned options and configuration. */
export const SUPERADMIN_FINANCE_PAYMENT_MODES = ['cash', 'upi', 'card', 'bank'] as const;
/**
 * Defines the public SuperadminFinancePaymentMode contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminFinancePaymentMode = typeof SUPERADMIN_FINANCE_PAYMENT_MODES[number];
export const SUPERADMIN_FINANCE_MODE_LABELS: Record<SuperadminFinancePaymentMode, string> = { cash: 'Cash', upi: 'UPI', card: 'Card', bank: 'Bank Transfer' };
