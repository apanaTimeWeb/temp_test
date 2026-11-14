// RESPONSIBILITY: Define compile-time types for billing member payments collection; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_billing/billing_member_payments_collection/types/SuperadminBillingOverviewMemberPaymentsCollectionReceiptPreviewPanelComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_member_finance/superadmin_member_finance_components/superadmin_member_finance_views/superadmin_member_payments_collection_page/SuperadminBillingOverviewMemberPaymentsCollectionReceiptPreviewPanel.tsx. */
import type { SuperadminFinanceMockStudent } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/types/SuperadminBillingOverviewMemberPaymentsCollectionTypes';
import type { SuperadminFinancePaymentMode } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionConstants';

/**
 * Defines the public SuperadminFinanceReceiptPreviewPanelProps contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property selectedStudent Value defined by the existing feature-local contract. Declared type: SuperadminFinanceMockStudent | null.
 * @property mode Value defined by the existing feature-local contract. Declared type: SuperadminFinancePaymentMode.
 * @property total Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property nextReceiptNumber Value defined by the existing feature-local contract. Declared type: number.
 * @property canGenerate Boolean state used by the owning feature. Declared type: boolean.
 * @property onCancel Callback for the corresponding user interaction. Declared type: () => void.
 */
export interface SuperadminFinanceReceiptPreviewPanelProps {
  selectedStudent: SuperadminFinanceMockStudent | null;
  mode: SuperadminFinancePaymentMode;
  total: number;
  nextReceiptNumber: number;
  canGenerate: boolean;
  onCancel: () => void;
}
