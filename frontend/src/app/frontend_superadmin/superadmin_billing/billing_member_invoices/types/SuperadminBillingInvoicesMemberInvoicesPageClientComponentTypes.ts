// RESPONSIBILITY: Define compile-time types for billing member invoices; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_billing/billing_member_invoices/types/SuperadminBillingInvoicesMemberInvoicesPageClientComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_member_finance/superadmin_member_finance_components/superadmin_member_finance_views/superadmin_member_invoices_page/SuperadminBillingInvoicesMemberInvoicesPageClient.tsx. */
export type FilterStatus = 'all' | 'paid' | 'pending' | 'overdue';
