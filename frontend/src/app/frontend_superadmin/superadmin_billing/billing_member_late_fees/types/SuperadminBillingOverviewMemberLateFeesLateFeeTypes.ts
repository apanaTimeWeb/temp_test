// FLOW: Feature source -> superadmin_billing/billing_member_late_fees/types/SuperadminBillingOverviewMemberLateFeesLateFeeTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Finance Late Fee Types; defines module-owned type contracts for the named data boundary. */
export interface SuperadminFinanceOverdueSample {
  studentId: string;
  studentName: string;
  smartId: string;
  phone: string;
  dueDate: string;
  daysOverdue: number;
  accruedFee: number;
  totalDue: number;
}

/**
 * Defines the public SuperadminFinanceLateFeeConfig contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property gracePeriodDays Value defined by the existing feature-local contract. Declared type: number.
 * @property penaltyPerDay Value defined by the existing feature-local contract. Declared type: number.
 */
export interface SuperadminFinanceLateFeeConfig {
  gracePeriodDays: number;
  penaltyPerDay: number;
}
