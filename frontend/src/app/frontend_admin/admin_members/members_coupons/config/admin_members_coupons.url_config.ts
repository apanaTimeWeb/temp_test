/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */


/** Canonical UI route and explicit backend-contract status for members_coupons. */
export const ADMIN_COUPONS_ROOT = '/admin/admin_members/members_coupons' as const;

/** No dedicated browser detail route is implemented; records open inside the owning page. */
export const ADMIN_COUPONS_DETAIL: ((id: string) => string) | null = null;

/** CONTRACT_MISSING: supplied source has no verified API endpoint; never substitute the UI route. */
export const ADMIN_COUPONS_API_LIST: string | null = null;

/** CONTRACT_MISSING: no verified detail endpoint/path contract is supplied. */
export const ADMIN_COUPONS_API_DETAIL: ((id: string) => string) | null = null;

export const ADMIN_COUPONS_URLS = {
  ROOT: ADMIN_COUPONS_ROOT,
  DETAIL: ADMIN_COUPONS_DETAIL,
  LIST: ADMIN_COUPONS_API_LIST,
  API_DETAIL: ADMIN_COUPONS_API_DETAIL,
} as const;

export const MODULE_URLS = ADMIN_COUPONS_URLS;

/** Canonical typed route contract owned by this autonomous submodule. */
export const ADMIN_MEMBERS_COUPONS_ROUTES = { ROOT: ADMIN_COUPONS_ROOT, DETAIL: ADMIN_COUPONS_DETAIL } as const;

/** Canonical API contract. Null values remain unavailable when no endpoint is verified. */
export const ADMIN_MEMBERS_COUPONS_API = { LIST: ADMIN_COUPONS_API_LIST, DETAIL: ADMIN_COUPONS_API_DETAIL } as const;

/** Compatibility constant retained for existing route consumers; its value is unchanged. */
export const ADMIN_MEMBERS_COUPONS_CANONICAL_ROUTE = '/admin/admin_members/members_coupons' as const;

export const ADMIN_COUPONS_STATUS_VALUES = ['Active', 'Expired', 'Exhausted'] as const;

export const ADMIN_COUPONS_UNKNOWN_STATUS = 'Unknown' as const;

export const ADMIN_COUPONS_EMPTY_FORM = { code: '', discount: '', type: 'Flat' as const, maxUses: '', expiry: '' };

export const ADMIN_COUPONS_MESSAGES = { loadError: 'Unable to load coupons. Please retry.', mutationBlocked: 'Coupon mutations require a verified API contract; no local success was fabricated.' } as const;
