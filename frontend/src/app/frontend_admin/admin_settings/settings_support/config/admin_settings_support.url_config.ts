/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */
import { Activity, BellRing, BookOpen, LifeBuoy, Ticket } from 'lucide-react';
import type { AdminSupportNavigationItem } from '@/app/frontend_admin/admin_settings/settings_support/types/AdminSettingsSupportTypes';

/** Canonical, source-observed UI route contract. No support-ticket API endpoint is verified in this source scope. */
export const ADMIN_SETTINGS_SUPPORT_ROUTES = { ROOT: '/admin/admin_settings/settings_support' } as const;

export const ADMIN_SETTINGS_SUPPORT_API = {} as const;

export const ADMIN_SETTINGS_SUPPORT_CANONICAL_ROUTE = ADMIN_SETTINGS_SUPPORT_ROUTES.ROOT;

/** Canonical route and API URL registry for admin_support. */
export const ADMIN_SUPPORT_ROOT = '/admin/admin_settings/settings_support' as const;
export const ADMIN_SUPPORT_DETAIL = (id: string) => `${ ADMIN_SUPPORT_ROOT}/${id}` as const;
/** Legacy MSW sentinel URL only; this path is not a verified live backend contract. */
export const ADMIN_SUPPORT_API_LIST = '/api/v1/admin/support' as const;
export const ADMIN_SUPPORT_API_DETAIL = (id: string) => `${ ADMIN_SUPPORT_API_LIST}/${id}` as const;

export const ADMIN_SUPPORT_URLS = {
  ROOT: ADMIN_SUPPORT_ROOT,
  DETAIL: ADMIN_SUPPORT_DETAIL,
  LIST: ADMIN_SUPPORT_API_LIST,
  API_DETAIL: ADMIN_SUPPORT_API_DETAIL,
} as const;

export const MODULE_URLS = ADMIN_SUPPORT_URLS;

export const ADMIN_SUPPORT_TICKET_CATEGORIES = ['bug', 'feature', 'billing', 'other'] as const;

export const ADMIN_SUPPORT_TICKET_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;

export const ADMIN_SUPPORT_NAVIGATION_ITEMS: readonly AdminSupportNavigationItem[] = [
  { id: 'help', labelKey: 'NAV_HELP', icon: LifeBuoy },
  { id: 'tickets', labelKey: 'NAV_TICKETS', icon: Ticket },
  { id: 'status', labelKey: 'NAV_STATUS', icon: Activity },
  { id: 'announcements', labelKey: 'NAV_ANNOUNCEMENTS', icon: BellRing },
  { id: 'docs', labelKey: 'NAV_DOCS', icon: BookOpen },
] as const;

const ADMIN_SUPPORT_CATEGORY_LABEL_KEYS = {
  bug: 'CATEGORY_BUG',
  feature: 'CATEGORY_FEATURE',
  billing: 'CATEGORY_BILLING',
  other: 'CATEGORY_OTHER',
} as const satisfies Record<(typeof ADMIN_SUPPORT_TICKET_CATEGORIES)[number], 'CATEGORY_BUG' | 'CATEGORY_FEATURE' | 'CATEGORY_BILLING' | 'CATEGORY_OTHER'>;

const ADMIN_SUPPORT_PRIORITY_LABEL_KEYS = {
  low: 'PRIORITY_LOW',
  medium: 'PRIORITY_MEDIUM',
  high: 'PRIORITY_HIGH',
  critical: 'PRIORITY_CRITICAL',
} as const satisfies Record<(typeof ADMIN_SUPPORT_TICKET_PRIORITIES)[number], 'PRIORITY_LOW' | 'PRIORITY_MEDIUM' | 'PRIORITY_HIGH' | 'PRIORITY_CRITICAL'>;

/** Option values come from the schema's canonical enum arrays; only locale keys are added here. */
export const ADMIN_SUPPORT_TICKET_CATEGORY_OPTIONS = ADMIN_SUPPORT_TICKET_CATEGORIES.map((value) => ({
  value,
  labelKey: ADMIN_SUPPORT_CATEGORY_LABEL_KEYS[value],
}));

export const ADMIN_SUPPORT_TICKET_PRIORITY_OPTIONS = ADMIN_SUPPORT_TICKET_PRIORITIES.map((value) => ({
  value,
  labelKey: ADMIN_SUPPORT_PRIORITY_LABEL_KEYS[value],
}));
