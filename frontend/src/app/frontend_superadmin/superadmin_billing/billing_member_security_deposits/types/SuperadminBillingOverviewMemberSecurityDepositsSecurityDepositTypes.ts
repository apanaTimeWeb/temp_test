// FLOW: Feature source -> superadmin_billing/billing_member_security_deposits/types/SuperadminBillingOverviewMemberSecurityDepositsSecurityDepositTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Finance Security Deposit Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminFinanceSecurityDepositStatus = 'held' | 'refunded' | 'forfeited';

/**
 * Defines the public SuperadminFinanceSecurityDepositSample contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: number.
 * @property studentName Display label for the owning feature. Declared type: string.
 * @property smartId Stable identifier for the associated record. Declared type: string.
 * @property depositAmount Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property collectedBy Value defined by the existing feature-local contract. Declared type: string.
 * @property collectedDate Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property deductionAmount Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property deductionReason Value defined by the existing feature-local contract. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminFinanceSecurityDepositStatus.
 * @property refundedDate Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 */
export interface SuperadminFinanceSecurityDepositSample {
  id: number;
  studentName: string;
  smartId: string;
  depositAmount: number;
  collectedBy: string;
  collectedDate: string;
  deductionAmount: number;
  deductionReason?: string;
  status: SuperadminFinanceSecurityDepositStatus;
  refundedDate?: string;
}
