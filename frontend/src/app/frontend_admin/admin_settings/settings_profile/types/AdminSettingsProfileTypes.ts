import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export const AdminSettingsProfileScenarios = [
  'ACTIVE_RECORDS',
  'EMPTY_DATA',
  'SERVER_500_ERROR',
  'NETWORK_TIMEOUT',
  'UNAUTHORIZED_401',
  'FORBIDDEN_403',
  'NETWORK_ERROR',
  'INVALID_RESPONSE',
] as const;
export type AdminSettingsProfileScenario = (typeof AdminSettingsProfileScenarios)[number];

export type AdminProfileTab = 'profile' | 'subscription' | 'edit' | 'branches' | 'password' | '2fa' | 'dashboard' | 'sessions' | 'failed-logins' | 'blocked-users' | 'audit-trail' | 'history' | 'security';
export type AdminProfileNavigationItemLabelKey = 'NAV_PROFILE' | 'NAV_SUBSCRIPTION' | 'NAV_EDIT' | 'NAV_BRANCHES' | 'NAV_PASSWORD' | 'NAV_TWO_FACTOR' | 'NAV_DASHBOARD' | 'NAV_SESSIONS' | 'NAV_FAILED_LOGINS' | 'NAV_BLOCKED_USERS' | 'NAV_AUDIT_TRAIL' | 'NAV_HISTORY' | 'NAV_SECURITY';
export interface AdminProfileNavigationItem { id: AdminProfileTab; labelKey: AdminProfileNavigationItemLabelKey; label: string; icon: LucideIcon }

export interface AdminSettingsProfileHarnessProps { children: ReactNode; scenario?: AdminSettingsProfileScenario }
export interface AdminSettingsProfileFormProps { onDirtyChange: (isDirty: boolean) => void }
export interface AdminSettingsProfileUnsavedChangesDialogProps { open: boolean; onOpenChange: (open: boolean) => void; onStay: () => void; onLeave: () => void }
export type AdminSettingsProfileReadOnlyView = 'profile' | 'subscription' | 'history' | 'sessions';
export interface AdminSettingsProfileReadOnlyPanelsProps { view: AdminSettingsProfileReadOnlyView }
