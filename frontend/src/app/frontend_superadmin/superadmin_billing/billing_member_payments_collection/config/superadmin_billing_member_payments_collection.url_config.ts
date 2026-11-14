// RESPONSIBILITY: Define canonical route/configuration constants for billing member payments collection; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_billing/billing_member_payments_collection/config/superadmin_billing_member_payments_collection.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_payments_collection workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_FINANCE_MEMBER_PAYMENTS_COLLECTION_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_member_payments_collection',
  SCREEN: '/superadmin/superadmin_billing/billing_overview?view=member_payments_collection',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_COLLECTION_FINANCE_COLLECT_FEE_URLS = {
  PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_payments_collection',
  SCREEN: '/superadmin/superadmin_billing/billing_overview?view=member_payments_collection',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_BILLING_MEMBER_PAYMENTS_COLLECTION_ROUTES = {
  SUPERADMIN_FINANCE_MEMBER_PAYMENTS_COLLECTION_URLS: SUPERADMIN_FINANCE_MEMBER_PAYMENTS_COLLECTION_URLS,
  SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_COLLECTION_FINANCE_COLLECT_FEE_URLS: SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_COLLECTION_FINANCE_COLLECT_FEE_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_BILLING_MEMBER_PAYMENTS_COLLECTION_API = {} as const;
