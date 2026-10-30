/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */


/** Canonical route and observed API URL contract for enquiries. */
export const ADMIN_ENQUIRIES_ROOT = '/admin/admin_members/members_enquiries' as const;

const enquiriesViewRoute = (view: 'enquiries/add' | 'enquiries/detail') =>
  `${ADMIN_ENQUIRIES_ROOT}?view=${encodeURIComponent(view)}` as const;

export const ADMIN_ENQUIRIES_ROUTE_ENQUIRIES = ADMIN_ENQUIRIES_ROOT;

export const ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ADD = enquiriesViewRoute('enquiries/add');

export const ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ID = (id: string) =>
  `${enquiriesViewRoute('enquiries/detail')}&id=${encodeURIComponent(id)}` as const;

/** Observed in the archived source URL config; the active screen remains demo-only and does not currently issue API requests. */
export const ADMIN_ENQUIRIES_API_LIST = '/api/v1/admin/crm' as const;

export const ADMIN_ENQUIRIES_API_DETAIL = (id: string) => `${ADMIN_ENQUIRIES_API_LIST}/${encodeURIComponent(id)}` as const;

export const ADMIN_ENQUIRIES_URLS = { ROOT: ADMIN_ENQUIRIES_ROOT, LIST: ADMIN_ENQUIRIES_API_LIST, API_DETAIL: ADMIN_ENQUIRIES_API_DETAIL, ENQUIRIES: ADMIN_ENQUIRIES_ROOT, ENQUIRY_DETAIL: ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ID, ROUTE_ENQUIRIES_ID: ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ID, ROUTE_ENQUIRIES_ADD: ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ADD, ROUTE_ENQUIRIES: ADMIN_ENQUIRIES_ROUTE_ENQUIRIES } as const;

export const MODULE_URLS = ADMIN_ENQUIRIES_URLS;

/** Canonical typed route contract owned by this autonomous submodule. */
export const ADMIN_MEMBERS_ENQUIRIES_ROUTES = { ROOT: ADMIN_ENQUIRIES_ROOT, ADD: ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ADD, DETAIL: ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ID } as const;

/** Canonical API contract. Null values remain unavailable when no endpoint is verified. */
export const ADMIN_MEMBERS_ENQUIRIES_API = { LIST: ADMIN_ENQUIRIES_API_LIST, DETAIL: ADMIN_ENQUIRIES_API_DETAIL } as const;

/** Compatibility constant retained for existing route consumers; its value is unchanged. */
export const ADMIN_MEMBERS_ENQUIRIES_CANONICAL_ROUTE = '/admin/admin_members/members_enquiries' as const;

export const ADMIN_ENQUIRIES_ENQUIRY_STATUS_VALUES = ['New', 'Visited', 'Interested', 'Converted', 'Lost'] as const;

export type EnquiryStatus = (typeof ADMIN_ENQUIRIES_ENQUIRY_STATUS_VALUES)[number];

export const ADMIN_ENQUIRIES_ENQUIRY_SOURCE_VALUES = ['Walk-in', 'WhatsApp', 'Referral', 'Social Media', 'Phone Call', 'Google Ads', 'Instagram', 'Facebook', 'Other'] as const;

export type EnquirySource = (typeof ADMIN_ENQUIRIES_ENQUIRY_SOURCE_VALUES)[number];

export const ADMIN_ENQUIRIES_ENQUIRY_SOURCE_OPTIONS = ADMIN_ENQUIRIES_ENQUIRY_SOURCE_VALUES.map((value) => ({ value, label: value }));

export const ADMIN_ENQUIRIES_ENQUIRY_DOT_CLASSES: Record<EnquiryStatus, string> = {
  New: 'bg-primary',
  Visited: 'bg-warning',
  Interested: 'bg-info',
  Converted: 'bg-success',
  Lost: 'bg-danger',
};

export const ADMIN_ENQUIRIES_ENQUIRY_STATUS_FILTERS = ['All', ...ADMIN_ENQUIRIES_ENQUIRY_STATUS_VALUES] as const;

export const ADMIN_ENQUIRIES_ENQUIRY_KANBAN_COLUMNS = [
  { id: 'New', label: 'New', colorClass: 'text-primary', dotColor: 'bg-primary', cardClass: 'border-l-4 border-l-primary', badgeClass: 'bg-primary-subtle text-primary' },
  { id: 'Visited', label: 'Visited', colorClass: 'text-warning-text', dotColor: 'bg-warning', cardClass: 'border-l-4 border-l-warning', badgeClass: 'bg-warning-bg text-warning-text' },
  { id: 'Interested', label: 'Interested', colorClass: 'text-info-text', dotColor: 'bg-info', cardClass: 'border-l-4 border-l-info', badgeClass: 'bg-info-bg text-info-text' },
  { id: 'Converted', label: 'Converted', colorClass: 'text-success-text', dotColor: 'bg-success', cardClass: 'border-l-4 border-l-success', badgeClass: 'bg-success-bg text-success-text' },
  { id: 'Lost', label: 'Lost', colorClass: 'text-danger-text', dotColor: 'bg-danger', cardClass: 'border-l-4 border-l-danger', badgeClass: 'bg-surface-highlight text-text-secondary' },
] as const satisfies readonly { id: EnquiryStatus; label: string; colorClass: string; dotColor: string; cardClass: string; badgeClass: string }[];

export const ADMIN_ENQUIRIES_ENQUIRY_STATUS_BADGE: Record<EnquiryStatus, string> = {
  New: 'bg-primary-subtle text-primary',
  Visited: 'bg-warning-bg text-warning-text',
  Interested: 'bg-info-bg text-info-text',
  Converted: 'bg-success-bg text-success-text',
  Lost: 'bg-surface-highlight text-text-secondary',
};
