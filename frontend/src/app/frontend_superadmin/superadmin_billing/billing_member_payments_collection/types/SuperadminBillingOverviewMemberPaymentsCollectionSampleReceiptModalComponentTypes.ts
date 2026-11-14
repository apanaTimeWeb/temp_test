// RESPONSIBILITY: Define compile-time types for billing member payments collection; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_billing/billing_member_payments_collection/types/SuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptModalComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_member_finance/superadmin_member_finance_components/superadmin_member_finance_views/superadmin_member_payments_collection_page/SuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptModal.tsx. */
import type { SuperadminFinanceCollectFeeReceiptData } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/types/SuperadminBillingOverviewMemberPaymentsCollectionTypes';

/**
 * Defines the public SuperadminFinanceSampleReceiptModalProps contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property receiptData Value defined by the existing feature-local contract. Declared type: SuperadminFinanceCollectFeeReceiptData.
 * @property onClose Callback for the corresponding user interaction. Declared type: () => void.
 * @property onPrint Callback for the corresponding user interaction. Declared type: () => void.
 */
export interface SuperadminFinanceSampleReceiptModalProps {
  receiptData: SuperadminFinanceCollectFeeReceiptData;
  onClose: () => void;
  onPrint: () => void;
}
