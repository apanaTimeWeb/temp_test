// FLOW: Feature source -> superadmin_billing/billing_member_payments_collection/types/SuperadminBillingOverviewMemberPaymentsCollectionTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Finance Collect Fee Types; defines module-owned type contracts for the named data boundary. */
import type { SuperadminFinancePaymentMode } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionConstants';

/**
 * Defines the public SuperadminFinanceMockStudent contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminFinanceMockStudent = typeof import('@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/mocks/fixtures/SuperadminBillingOverviewMemberPaymentsCollectionMockStudents').SUPERADMIN_FINANCE_MOCK_STUDENTS[number];

/**
 * Defines the public SuperadminFinanceCollectFeeReceiptData contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property receiptNo Value defined by the existing feature-local contract. Declared type: string.
 * @property studentName Display label for the owning feature. Declared type: string.
 * @property studentId Stable identifier for the associated record. Declared type: string.
 * @property phone Value defined by the existing feature-local contract. Declared type: string.
 * @property total Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property mode Value defined by the existing feature-local contract. Declared type: SuperadminFinancePaymentMode.
 * @property date Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property waMessage User-safe error or explanatory message; raw exception details are not implied. Declared type: string.
 * @property student Value defined by the existing feature-local contract. Declared type: SuperadminFinanceMockStudent.
 * @property amount Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property lateFee Value defined by the existing feature-local contract. Declared type: number.
 * @property couponDiscount Value defined by the existing feature-local contract. Declared type: number.
 * @property txnId Stable identifier for the associated record. Declared type: string.
 * @property remark Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminFinanceCollectFeeReceiptData {
  receiptNo: string;
  studentName: string;
  studentId: string;
  phone: string;
  total: number;
  mode: SuperadminFinancePaymentMode;
  date: string;
  waMessage: string;
  student: SuperadminFinanceMockStudent;
  amount: number;
  lateFee: number;
  couponDiscount: number;
  txnId: string;
  remark: string;
}
