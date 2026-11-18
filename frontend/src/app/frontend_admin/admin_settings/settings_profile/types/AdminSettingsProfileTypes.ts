import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AdminSettingsProfileScenario } from '@/app/frontend_admin/admin_settings/settings_profile/mocks/scenarios/admin_settings_profile.scenarios';

export type AdminProfileTab = 'profile' | 'edit' | 'branches' | 'password' | '2fa' | 'dashboard' | 'sessions' | 'failed-logins' | 'blocked-users' | 'audit-trail' | 'history' | 'security';
export type AdminProfileNavigationItemLabelKey = 'NAV_PROFILE' | 'NAV_EDIT' | 'NAV_BRANCHES' | 'NAV_PASSWORD' | 'NAV_TWO_FACTOR' | 'NAV_DASHBOARD' | 'NAV_SESSIONS' | 'NAV_FAILED_LOGINS' | 'NAV_BLOCKED_USERS' | 'NAV_AUDIT_TRAIL' | 'NAV_HISTORY' | 'NAV_SECURITY';
export interface AdminProfileNavigationItem { id: AdminProfileTab; labelKey: AdminProfileNavigationItemLabelKey; label: string; icon: LucideIcon }

export interface AdminSettingsProfileHarnessProps { children: ReactNode; scenario?: AdminSettingsProfileScenario }
export interface AdminSettingsProfileFormProps { onDirtyChange: (isDirty: boolean) => void }
export interface AdminSettingsProfileUnsavedChangesDialogProps { open: boolean; onOpenChange: (open: boolean) => void; onStay: () => void; onLeave: () => void }
export type AdminSettingsProfileReadOnlyView = 'profile' | 'history' | 'sessions';
export interface AdminSettingsProfileReadOnlyPanelsProps { view: AdminSettingsProfileReadOnlyView }
