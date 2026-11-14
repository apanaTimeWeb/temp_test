// RESPONSIBILITY: Define compile-time types for billing member receipts; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_billing/billing_member_receipts/types/SuperadminBillingInvoicesMemberReceiptsPageClientComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_member_finance/superadmin_member_finance_components/superadmin_member_finance_views/superadmin_member_receipts_page/SuperadminBillingInvoicesMemberReceiptsPageClient.tsx. */
export type FilterMode = 'all' | 'upi' | 'cash' | 'card' | 'bank transfer';
