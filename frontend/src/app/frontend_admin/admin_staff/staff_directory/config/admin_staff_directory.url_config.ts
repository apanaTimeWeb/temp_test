/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */
import {
  Activity, Ban, CheckCircle2, Clock3, History, UserRound, UserRoundPlus, Users,
} from 'lucide-react';
import type { AdminStaffDirectoryTab } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import type { AdminStaffDirectoryNavigationItemLabelKey } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';


/** Canonical route and source-observed API paths retained from the existing module contract. */
export const ADMIN_STAFF_DIRECTORY_ROUTES = {
  route: '/admin/admin_staff/staff_directory',
  ROOT: '/admin/admin_staff/staff_directory',
  DETAIL: (id: string) => `/admin/admin_staff/staff_directory/${encodeURIComponent(id)}`,
} as const;

export const ADMIN_STAFF_DIRECTORY_API = {
  LIST: '/api/v1/admin/staff_users',
  DETAIL: (id: string) => `/api/v1/admin/staff_users/${encodeURIComponent(id)}`,
} as const;

export const ADMIN_STAFF_DIRECTORY_CANONICAL_ROUTE = ADMIN_STAFF_DIRECTORY_ROUTES.ROOT;

export const ADMIN_STAFF_DIRECTORY_ROOT = ADMIN_STAFF_DIRECTORY_ROUTES.ROOT;

export const ADMIN_STAFF_DIRECTORY_DETAIL = ADMIN_STAFF_DIRECTORY_ROUTES.DETAIL;

export const ADMIN_STAFF_DIRECTORY_API_LIST = ADMIN_STAFF_DIRECTORY_API.LIST;

export const ADMIN_STAFF_DIRECTORY_API_DETAIL = ADMIN_STAFF_DIRECTORY_API.DETAIL;

export const ADMIN_STAFF_DIRECTORY_URLS = {
  ROOT: ADMIN_STAFF_DIRECTORY_ROOT, DETAIL: ADMIN_STAFF_DIRECTORY_DETAIL,
  LIST: ADMIN_STAFF_DIRECTORY_API_LIST, API_DETAIL: ADMIN_STAFF_DIRECTORY_API_DETAIL,
} as const;

export const MODULE_URLS = ADMIN_STAFF_DIRECTORY_URLS;

export const ADMIN_STAFF_DIRECTORY_URL_CONFIG = { route: ADMIN_STAFF_DIRECTORY_CANONICAL_ROUTE, routes: ADMIN_STAFF_DIRECTORY_ROUTES, api: ADMIN_STAFF_DIRECTORY_API } as const;

export const ADMIN_STAFF_DIRECTORY_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const ADMIN_STAFF_DIRECTORY_DEFAULT_PAGE_SIZE = 25 as const;

export const ADMIN_STAFF_DIRECTORY_MANAGER_STATUS_OPTIONS = ['Active', 'Suspended', 'Deactivated'] as const;

export const ADMIN_STAFF_DIRECTORY_INITIAL_STATUS_OPTIONS = ['Active', 'Suspended'] as const;

export const ADMIN_STAFF_DIRECTORY_STATUS_BADGE_CLASSES = {
  Active: 'bg-success-bg text-success-text',
  Suspended: 'bg-warning-bg text-warning-text',
  Deactivated: 'bg-danger-bg text-danger-text',
} as const;

export const ADMIN_STAFF_DIRECTORY_DEMO_BRANCH_OPTIONS = [
  { id: 'b1', label: 'Demo Downtown Branch' },
  { id: 'b2', label: 'Demo Westside Branch' },
] as const;

export interface AdminStaffDirectoryNavigationItem {
  id: AdminStaffDirectoryTab;
  labelKey: AdminStaffDirectoryNavigationItemLabelKey;
  icon: typeof Users;
}

export const ADMIN_STAFF_DIRECTORY_NAVIGATION: readonly AdminStaffDirectoryNavigationItem[] = [
  { id: 'all', labelKey: 'NAV_ALL', icon: Users },
  { id: 'add', labelKey: 'NAV_ADD', icon: UserRoundPlus },
  { id: 'active', labelKey: 'NAV_ACTIVE', icon: CheckCircle2 },
  { id: 'suspended', labelKey: 'NAV_SUSPENDED', icon: Ban },
  { id: 'deactivated', labelKey: 'NAV_DEACTIVATED', icon: UserRound },
  { id: 'sessions', labelKey: 'NAV_SESSIONS', icon: Clock3 },
  { id: 'history', labelKey: 'NAV_HISTORY', icon: History },
  { id: 'activity', labelKey: 'NAV_ACTIVITY', icon: Activity },
];
