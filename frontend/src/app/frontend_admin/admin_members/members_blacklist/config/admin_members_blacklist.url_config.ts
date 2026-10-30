/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */


/** Canonical UI route and explicit backend-contract status for members_blacklist. */
export const ADMIN_BLACKLIST_ROOT = '/admin/admin_members/members_blacklist' as const;

/** No dedicated browser detail route is implemented; records open inside the owning page. */
export const ADMIN_BLACKLIST_DETAIL: ((id: string) => string) | null = null;

/** CONTRACT_MISSING: supplied source has no verified API endpoint; never substitute the UI route. */
export const ADMIN_BLACKLIST_API_LIST: string | null = null;

/** CONTRACT_MISSING: no verified detail endpoint/path contract is supplied. */
export const ADMIN_BLACKLIST_API_DETAIL: ((id: string) => string) | null = null;

export const ADMIN_BLACKLIST_URLS = {
  ROOT: ADMIN_BLACKLIST_ROOT,
  DETAIL: ADMIN_BLACKLIST_DETAIL,
  LIST: ADMIN_BLACKLIST_API_LIST,
  API_DETAIL: ADMIN_BLACKLIST_API_DETAIL,
} as const;

export const MODULE_URLS = ADMIN_BLACKLIST_URLS;

/** Canonical typed route contract owned by this autonomous submodule. */
export const ADMIN_MEMBERS_BLACKLIST_ROUTES = { ROOT: ADMIN_BLACKLIST_ROOT, DETAIL: ADMIN_BLACKLIST_DETAIL } as const;

/** Canonical API contract. Null values remain unavailable when no endpoint is verified. */
export const ADMIN_MEMBERS_BLACKLIST_API = { LIST: ADMIN_BLACKLIST_API_LIST, DETAIL: ADMIN_BLACKLIST_API_DETAIL } as const;

/** Compatibility constant retained for existing route consumers; its value is unchanged. */
export const ADMIN_MEMBERS_BLACKLIST_CANONICAL_ROUTE = '/admin/admin_members/members_blacklist' as const;

export const ADMIN_BLACKLIST_STATUS_VALUES = ['Blacklisted'] as const;

export const ADMIN_BLACKLIST_EMPTY_FORM = { name: '', phone: '', reason: '', previousSeat: '' } as const;
