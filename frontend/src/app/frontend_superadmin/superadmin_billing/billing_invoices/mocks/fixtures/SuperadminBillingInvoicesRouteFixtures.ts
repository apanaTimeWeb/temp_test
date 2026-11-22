// RESPONSIBILITY: Define local sample fixtures for billing invoices; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_invoices/mocks/fixtures/SuperadminBillingInvoicesRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINBILLINGINVOICES_ROUTE_FIXTURE = { route: '/superadmin/superadmin_billing/billing_invoices', source: 'local-preview' } as const;
