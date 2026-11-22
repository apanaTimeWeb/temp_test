// RESPONSIBILITY: Define stable module-owned constants for plans promotions; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_plans/plans_promotions/constants/SuperadminPlansPromotionsStaticConstants.ts -> typed constants -> component/hook/config behavior.


/** Static module-owned options/status mapping extracted from SuperadminPlansPromotionsPageClient.tsx. */
export const SUPERADMIN_BILLING_OVERVIEW_PAGE_CLIENT_FOCUSABLE_SELECTOR = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';


