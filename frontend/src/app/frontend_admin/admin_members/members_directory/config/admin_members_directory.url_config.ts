/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */
import type { LucideIcon } from 'lucide-react';
import { Users, UserPlus, Tags, Building, BookOpen, RotateCcw, CheckCircle, AlertTriangle, PauseCircle, Ban, UploadCloud, DownloadCloud, FileText, Calendar, CreditCard, Activity } from 'lucide-react';
import type { AdminMembersDetailTab, AdminMembersDirectoryTab } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';

/** Source-backed Members API registry, separate from the browser UI route registry. */
export const ADMIN_MEMBERS_ROOT = '/admin/admin_members/members_directory' as const;

/** Member details are currently an in-module view; no nested detail URL is declared. */
export const ADMIN_MEMBERS_DETAIL = (_id: string): null => null;

/** Verified from the original Members API URL configuration; DTO availability remains separately gated. */
export const ADMIN_MEMBERS_API_LIST = '/api/v1/admin/members' as const;

export const ADMIN_MEMBERS_API_DETAIL = (id: string) => `${ADMIN_MEMBERS_API_LIST}/${encodeURIComponent(id)}` as const;

export const ADMIN_MEMBERS_UI_URLS = {
  ROOT: ADMIN_MEMBERS_ROOT,
  DETAIL: ADMIN_MEMBERS_DETAIL,
} as const;

export const ADMIN_MEMBERS_API_URLS = {
  LIST: ADMIN_MEMBERS_API_LIST,
  DETAIL: ADMIN_MEMBERS_API_DETAIL,
} as const;

/** Kept for the module-owned API contract sentinel; do not use as a UI router registry. */
export const ADMIN_MEMBERS_URLS = {
  ...ADMIN_MEMBERS_UI_URLS,
  LIST: ADMIN_MEMBERS_API_LIST,
  API_DETAIL: ADMIN_MEMBERS_API_DETAIL,
} as const;

/** Feature module URL registry is UI-only; API paths are exported separately above. */
export const MODULE_URLS = ADMIN_MEMBERS_UI_URLS;

/** Canonical typed route contract owned by this autonomous submodule. */
export const ADMIN_MEMBERS_DIRECTORY_ROUTES = { ROOT: ADMIN_MEMBERS_ROOT, DETAIL: ADMIN_MEMBERS_DETAIL } as const;

/** Canonical API contract. Null values remain unavailable when no endpoint is verified. */
export const ADMIN_MEMBERS_DIRECTORY_API = { LIST: ADMIN_MEMBERS_API_LIST, DETAIL: ADMIN_MEMBERS_API_DETAIL } as const;

/** Compatibility constant retained for existing route consumers; its value is unchanged. */
export const ADMIN_MEMBERS_DIRECTORY_CANONICAL_ROUTE = '/admin/admin_members/members_directory' as const;

export type AdminMembersDirectoryNavigationLabelKey =
  | 'NAV_ALL_MEMBERS' | 'NAV_ADD_MEMBER' | 'NAV_CATEGORIES' | 'NAV_DEPARTMENTS' | 'NAV_PLANS'
  | 'NAV_RENEWAL' | 'NAV_ACTIVE' | 'NAV_EXPIRED' | 'NAV_SUSPENDED' | 'NAV_BLOCKED'
  | 'NAV_IMPORT' | 'NAV_EXPORT' | 'NAV_DOCUMENTS';

export type AdminMembersDetailNavigationLabelKey =
  | 'DETAIL_PROFILE' | 'DETAIL_ATTENDANCE' | 'DETAIL_MEMBERSHIP' | 'DETAIL_RENEWAL_HISTORY'
  | 'DETAIL_PAYMENT_HISTORY' | 'DETAIL_LOST_HISTORY' | 'DETAIL_ACTIVITY_HISTORY' | 'DETAIL_DOCUMENTS';

export interface AdminMembersNavigationItem {
  id: AdminMembersDirectoryTab;
  labelKey: AdminMembersDirectoryNavigationLabelKey;
  icon: LucideIcon;
  color: string;
}

export interface AdminMembersDetailNavigationItem {
  id: AdminMembersDetailTab;
  labelKey: AdminMembersDetailNavigationLabelKey;
  icon: LucideIcon;
}

/** Query-state contract includes compatibility deep links that are intentionally not sidebar tabs. */
export const ADMIN_MEMBERS_DIRECTORY_SUPPORTED_VIEWS = [
  'all', 'add', 'categories', 'departments', 'plans', 'renewal', 'active', 'expired', 'suspended', 'blocked', 'import', 'export', 'documents',
] as const satisfies readonly AdminMembersDirectoryTab[];

/** Resolves explicit legacy deep links without exposing compatibility-only views in primary navigation. */
export function resolveAdminMembersDirectoryView(value: string | null): AdminMembersDirectoryTab {
  return ADMIN_MEMBERS_DIRECTORY_SUPPORTED_VIEWS.some((view) => view === value) ? value as AdminMembersDirectoryTab : 'all';
}

export const ADMIN_MEMBERS_DIRECTORY_NAVIGATION: readonly AdminMembersNavigationItem[] = [
  { id: 'all', labelKey: 'NAV_ALL_MEMBERS', icon: Users, color: 'primary' },
  { id: 'add', labelKey: 'NAV_ADD_MEMBER', icon: UserPlus, color: 'success' },
  { id: 'categories', labelKey: 'NAV_CATEGORIES', icon: Tags, color: 'purple' },
  { id: 'departments', labelKey: 'NAV_DEPARTMENTS', icon: Building, color: 'info' },
  { id: 'active', labelKey: 'NAV_ACTIVE', icon: CheckCircle, color: 'success' },
  { id: 'expired', labelKey: 'NAV_EXPIRED', icon: AlertTriangle, color: 'danger' },
  { id: 'suspended', labelKey: 'NAV_SUSPENDED', icon: PauseCircle, color: 'warning' },
  { id: 'blocked', labelKey: 'NAV_BLOCKED', icon: Ban, color: 'danger' },
  { id: 'import', labelKey: 'NAV_IMPORT', icon: UploadCloud, color: 'primary' },
  { id: 'export', labelKey: 'NAV_EXPORT', icon: DownloadCloud, color: 'primary' },
  { id: 'documents', labelKey: 'NAV_DOCUMENTS', icon: FileText, color: 'purple' },
];

export const ADMIN_MEMBERS_DETAIL_NAVIGATION: readonly AdminMembersDetailNavigationItem[] = [
  { id: 'profile', labelKey: 'DETAIL_PROFILE', icon: Users },
  { id: 'attendance', labelKey: 'DETAIL_ATTENDANCE', icon: Calendar },
  { id: 'membership', labelKey: 'DETAIL_MEMBERSHIP', icon: BookOpen },
  { id: 'renewalHistory', labelKey: 'DETAIL_RENEWAL_HISTORY', icon: RotateCcw },
  { id: 'paymentHistory', labelKey: 'DETAIL_PAYMENT_HISTORY', icon: CreditCard },
  { id: 'lostHistory', labelKey: 'DETAIL_LOST_HISTORY', icon: AlertTriangle },
  { id: 'activityHistory', labelKey: 'DETAIL_ACTIVITY_HISTORY', icon: Activity },
  { id: 'documents', labelKey: 'DETAIL_DOCUMENTS', icon: FileText },
];

/** Canonical status vocabulary for member records and their UI filters. */
export const ADMIN_MEMBERS_STATUS_VALUES = ['Active', 'Expired', 'Suspended', 'Blocked'] as const;

export type AdminMembersStatus = (typeof ADMIN_MEMBERS_STATUS_VALUES)[number];

export const ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS = [
  { labelKey: 'EXPORT_STATUS_ALL', value: 'all' },
  { labelKey: 'EXPORT_STATUS_ACTIVE', value: ADMIN_MEMBERS_STATUS_VALUES[0] },
  { labelKey: 'EXPORT_STATUS_EXPIRED', value: ADMIN_MEMBERS_STATUS_VALUES[1] },
  { labelKey: 'EXPORT_STATUS_SUSPENDED', value: ADMIN_MEMBERS_STATUS_VALUES[2] },
  { labelKey: 'EXPORT_STATUS_BLOCKED', value: ADMIN_MEMBERS_STATUS_VALUES[3] },
] as const;

export const ADMIN_MEMBERS_EXPORT_PLAN_OPTIONS = [
  { labelKey: 'EXPORT_PLAN_ALL', value: 'all' },
  { labelKey: 'EXPORT_PLAN_PREMIUM', value: 'Premium' },
  { labelKey: 'EXPORT_PLAN_STANDARD', value: 'Standard' },
] as const;

export const ADMIN_MEMBERS_DOCUMENT_FIXTURES = [
  { memberId: 'MEM-001', memberLabel: 'MEM-001 (John Doe)', type: 'Aadhar Card', date: '2026-01-15' },
  { memberId: 'MEM-002', memberLabel: 'MEM-002 (Jane Smith)', type: 'College ID', date: '2026-01-20' },
  { memberId: 'MEM-003', memberLabel: 'MEM-003 (Rahul Sharma)', type: 'Photo ID', date: '2026-02-05' },
] as const;

/** Dedicated TanStack Query key registry for this autonomous submodule. */
