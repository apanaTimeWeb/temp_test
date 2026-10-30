import type { AdminSecurityEvent, AdminSecurityEventFilter } from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';

/** Filters the explicitly synthetic event set by its typed category, not by localized display strings. */
export function filterAdminSecurityEvents(
  events: readonly AdminSecurityEvent[],
  filter: AdminSecurityEventFilter,
): AdminSecurityEvent[] {
  if (filter === 'all') return [...events];
  return events.filter((event) => event.category === filter);
}
