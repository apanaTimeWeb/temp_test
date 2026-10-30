/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */
import {
  Activity, Archive, BarChart3, Building2, CheckCircle2, ClipboardList,
  PauseCircle, Plus, Settings, Users,
} from 'lucide-react';
import type { AdminBranchesDetailTab, AdminSettingsBranchesTab } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';

/** Canonical route and API contract for admin_settings_branches. Paths are source-observed from the current frontend call sites. */
export const ADMIN_SETTINGS_BRANCHES_ROUTES = {
  route: '/admin/admin_settings/settings_branches',
  ROOT: '/admin/admin_settings/settings_branches',
  VIEW: (view: string) => `/admin/admin_settings/settings_branches?view=${encodeURIComponent(view)}`,
  DETAIL: (id: string) => `/admin/admin_settings/settings_branches/${encodeURIComponent(id)}`,
} as const;

/** Compatibility alias for the verified canonical root route. */
export const ADMIN_SETTINGS_BRANCHES_CANONICAL_ROUTE = ADMIN_SETTINGS_BRANCHES_ROUTES.ROOT;

/** API paths observed in the existing module API adapter and its MSW handler. */
export const ADMIN_SETTINGS_BRANCHES_API = {
  LIST: '/api/v1/admin/branches',
  DETAIL: (id: string) => `/api/v1/admin/branches/${encodeURIComponent(id)}`,
} as const;

export const ADMIN_BRANCHES_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const ADMIN_BRANCHES_DEFAULT_PAGE_SIZE = 25 as const;

export const ADMIN_BRANCHES_STATUS_OPTIONS = ['Active', 'Suspended', 'Archived'] as const;

export type AdminBranchesStatus = (typeof ADMIN_BRANCHES_STATUS_OPTIONS)[number];

export interface AdminBranchesNavigationItem {
  id: AdminSettingsBranchesTab;
  label: string;
  icon: typeof Building2;
}

export interface AdminBranchesDetailNavigationItem {
  id: AdminBranchesDetailTab;
  label: string;
  icon: typeof Building2;
}

export const ADMIN_SETTINGS_BRANCHES_NAVIGATION: readonly AdminBranchesNavigationItem[] = [
  { id: 'all', label: 'All branches', icon: Building2 },
  { id: 'create', label: 'Create branch', icon: Plus },
  { id: 'active', label: 'Active branches', icon: CheckCircle2 },
  { id: 'suspended', label: 'Suspended branches', icon: PauseCircle },
  { id: 'archived', label: 'Archived branches', icon: Archive },
  { id: 'managers', label: 'Branch managers', icon: Users },
  { id: 'settings', label: 'Global settings', icon: Settings },
  { id: 'usage', label: 'Usage', icon: Activity },
  { id: 'reports', label: 'Comparison reports', icon: BarChart3 },
];

export const ADMIN_BRANCHES_DETAIL_NAVIGATION: readonly AdminBranchesDetailNavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'reservations', label: 'Reservations', icon: ClipboardList },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'audit', label: 'Audit log', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];
