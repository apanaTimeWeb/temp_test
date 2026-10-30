/** Canonical browser route and source-observed API path for the asset-register module. */
export const ADMIN_ASSETS_REGISTER_ROUTES = {
  root: '/admin/admin_accounts_assets/assets_register',
} as const;

/** `list` is the existing source-observed generic accounting path; its asset DTO remains unverified. */
export const ADMIN_ASSETS_REGISTER_API = {
  list: '/api/v1/admin/accounting',
} as const;

/** Feature-local static UI configuration; kept module-owned to avoid sibling business imports. */
export const ADMIN_ASSETS_REGISTER_CATEGORY_OPTIONS = ['Appliance', 'Security', 'Furniture', 'Electronics', 'Other'] as const;

export const ADMIN_ASSETS_REGISTER_CATEGORY_TRANSLATION_KEY = {
  Appliance: 'CATEGORY_APPLIANCE',
  Security: 'CATEGORY_SECURITY',
  Furniture: 'CATEGORY_FURNITURE',
  Electronics: 'CATEGORY_ELECTRONICS',
  Other: 'CATEGORY_OTHER',
} as const;

export const ADMIN_ASSETS_REGISTER_STATUS_BADGE = {
  active: 'bg-success-bg text-success-text',
  maintenance: 'bg-warning-bg text-warning-text',
  disposed: 'bg-surface-zebra text-text-secondary',
} as const;

export const ADMIN_ASSETS_REGISTER_STATUS_TRANSLATION_KEY = {
  active: 'STATUS_ACTIVE',
  maintenance: 'STATUS_MAINTENANCE',
  disposed: 'STATUS_DISPOSED',
} as const;
