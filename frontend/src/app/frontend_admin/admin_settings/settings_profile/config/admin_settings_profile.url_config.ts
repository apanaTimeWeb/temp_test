/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */
import { Clock, Edit3, Key, MonitorSmartphone, Settings, Shield, User } from 'lucide-react';
import type { AdminProfileNavigationItem } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';

/** Canonical route and API contract for admin_settings_profile; API entries are source-observed only. */
export const ADMIN_SETTINGS_PROFILE_ROUTES = {
  ROOT: "/admin/admin_settings/settings_profile",
} as const;

export const ADMIN_SETTINGS_PROFILE_API = {
  // No verified API endpoint was supplied; do not infer one.
  CONTRACT_MISSING: null as string | null,
} as const;

/** Backward-compatible route constant for existing consumers. */
export const ADMIN_SETTINGS_PROFILE_CANONICAL_ROUTE = ADMIN_SETTINGS_PROFILE_ROUTES.ROOT;

export const ADMIN_PROFILE_ROOT = ADMIN_SETTINGS_PROFILE_ROUTES.ROOT;

export const ADMIN_PROFILE_URLS = { ROOT: ADMIN_PROFILE_ROOT } as const;

export const MODULE_URLS = ADMIN_PROFILE_URLS;

/** Role/module-owned navigation metadata; translations are supplied by ADMIN_PROFILE locale catalogs. */
export const ADMIN_PROFILE_NAVIGATION_ITEMS: readonly AdminProfileNavigationItem[] = [
  { id: 'profile', labelKey: 'NAV_PROFILE', icon: User },
  { id: 'edit', labelKey: 'NAV_EDIT', icon: Edit3 },
  { id: 'password', labelKey: 'NAV_PASSWORD', icon: Key },
  { id: '2fa', labelKey: 'NAV_TWO_FACTOR', icon: Shield },
  { id: 'history', labelKey: 'NAV_HISTORY', icon: Clock },
  { id: 'sessions', labelKey: 'NAV_SESSIONS', icon: MonitorSmartphone },
  { id: 'security', labelKey: 'NAV_SECURITY', icon: Settings },
] as const;

/**
 * Dedicated TanStack Query key registry for this autonomous submodule.
 *
 * This declaration reserves a namespaced cache-key shape only. It does not assert that a
 * live query, endpoint, response DTO, or cache invalidation flow is implemented. Introduce
 * consumers only after a verified module API/query contract exists.
 */
