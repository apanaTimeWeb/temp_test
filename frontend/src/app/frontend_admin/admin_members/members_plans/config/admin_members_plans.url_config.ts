/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */


/** Canonical UI route and explicit backend-contract status for members_plans. */
export const ADMIN_PLANS_ROOT = '/admin/admin_members/members_plans' as const;

/** No dedicated browser detail route is implemented; records open inside the owning page. */
export const ADMIN_PLANS_DETAIL: ((id: string) => string) | null = null;

/** CONTRACT_MISSING: supplied source has no verified API endpoint; never substitute the UI route. */
export const ADMIN_PLANS_API_LIST: string | null = null;

/** CONTRACT_MISSING: no verified detail endpoint/path contract is supplied. */
export const ADMIN_PLANS_API_DETAIL: ((id: string) => string) | null = null;

export const ADMIN_PLANS_URLS = {
  ROOT: ADMIN_PLANS_ROOT,
  DETAIL: ADMIN_PLANS_DETAIL,
  LIST: ADMIN_PLANS_API_LIST,
  API_DETAIL: ADMIN_PLANS_API_DETAIL,
} as const;

export const MODULE_URLS = ADMIN_PLANS_URLS;

/** Canonical typed route contract owned by this autonomous submodule. */
export const ADMIN_MEMBERS_PLANS_ROUTES = { ROOT: ADMIN_PLANS_ROOT, DETAIL: ADMIN_PLANS_DETAIL } as const;

/** Canonical API contract. Null values remain unavailable when no endpoint is verified. */
export const ADMIN_MEMBERS_PLANS_API = { LIST: ADMIN_PLANS_API_LIST, DETAIL: ADMIN_PLANS_API_DETAIL } as const;

/** Compatibility constant retained for existing route consumers; its value is unchanged. */
export const ADMIN_MEMBERS_PLANS_CANONICAL_ROUTE = '/admin/admin_members/members_plans' as const;

export const ADMIN_PLANS_STATUS_VALUES = ['Active', 'Inactive', 'Unknown'] as const;

export type AdminPlansStatus = (typeof ADMIN_PLANS_STATUS_VALUES)[number];

export const ADMIN_PLANS_MESSAGES={loadError:'Unable to load membership plans. Please retry.',mutationBlocked:'Plan mutations require a verified API mutation contract; no local success was fabricated.'} as const;
