/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */


/** Canonical route and API contract for admin_members_students; API entries are source-observed only. */
export const ADMIN_MEMBERS_STUDENTS_ROUTES = {
  ROOT: "/admin/admin_members/members_students",
} as const;

export const ADMIN_MEMBERS_STUDENTS_API = {
  // No verified API endpoint was supplied; do not infer one.
  CONTRACT_MISSING: null as string | null,
} as const;

/** Backward-compatible route constant for existing consumers. */
export const ADMIN_MEMBERS_STUDENTS_CANONICAL_ROUTE = ADMIN_MEMBERS_STUDENTS_ROUTES.ROOT;

export const ADMIN_STUDENTS_ROOT = ADMIN_MEMBERS_STUDENTS_ROUTES.ROOT;

export const ADMIN_STUDENTS_DETAIL = (id: string) => `${ADMIN_STUDENTS_ROOT}?view=detail&id=${encodeURIComponent(id)}` as const;

export const ADMIN_STUDENTS_API_LIST: string | null = null;

export const ADMIN_STUDENTS_API_DETAIL = (_id: string): string | null => null;

export const ADMIN_STUDENTS_UI_URLS = { ROOT: ADMIN_STUDENTS_ROOT, DETAIL: ADMIN_STUDENTS_DETAIL } as const;

export const ADMIN_STUDENTS_URLS = { ...ADMIN_STUDENTS_UI_URLS, LIST: ADMIN_STUDENTS_API_LIST, API_DETAIL: ADMIN_STUDENTS_API_DETAIL } as const;

export const ADMIN_STUDENTS_API_ENDPOINTS = { LIST: ADMIN_STUDENTS_API_LIST, DETAIL: ADMIN_STUDENTS_API_DETAIL } as const;

export const MODULE_URLS = ADMIN_STUDENTS_UI_URLS;

export const ADMIN_STUDENTS_BUSINESS_STATUSES = ['Active', 'Suspended', 'Blocked', 'Unknown'] as const;

export const ADMIN_STUDENTS_STATUSES = ['All', ...ADMIN_STUDENTS_BUSINESS_STATUSES] as const;

export const ADMIN_STUDENTS_KPI_STATUSES = [
  { label: 'Active', status: 'Active', color: 'success' },
  { label: 'Suspended', status: 'Suspended', color: 'warning' },
  { label: 'Blocked', status: 'Blocked', color: 'danger' },
  { label: 'Unknown', status: 'Unknown', color: 'secondary' },
] as const;

export const ADMIN_STUDENTS_STATUS_BADGE_CLASSES: Record<(typeof ADMIN_STUDENTS_BUSINESS_STATUSES)[number], string> = {
  Active: 'bg-success-bg text-success-text',
  Suspended: 'bg-warning-bg text-warning-text',
  Blocked: 'bg-danger-bg text-danger-text',
  Unknown: 'bg-card text-text-secondary',
};

export const ADMIN_STUDENTS_FEE_STATUS_BADGE_CLASSES = {
  Paid: 'bg-success-bg text-success-text',
  Due: 'bg-danger-bg text-danger-text',
  Unknown: 'bg-card text-text-secondary',
} as const;
