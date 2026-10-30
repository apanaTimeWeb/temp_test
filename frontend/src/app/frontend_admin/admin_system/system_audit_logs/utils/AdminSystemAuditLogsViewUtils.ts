import type { AdminAuditLogsFilter, AdminAuditLogsRecord } from '@/app/frontend_admin/admin_system/system_audit_logs/types/AdminSystemAuditLogsTypes';

/** Applies view-only search and severity filtering without mutating the query response. */
export function filterAdminAuditLogsRecords(records: readonly AdminAuditLogsRecord[], filter: AdminAuditLogsFilter, search: string): AdminAuditLogsRecord[] {
  const query = search.trim().toLocaleLowerCase();
  return records.filter((log) => {
    const severityMatches = filter === 'all' || log.severity === filter;
    const searchableValues = [log.action, log.module, log.performedBy, log.role, log.details, log.ip];
    const searchMatches = !query || searchableValues.some((value) => value.toLocaleLowerCase().includes(query));
    return severityMatches && searchMatches;
  });
}

import { format } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';

/** Formats valid backend instants in the active locale; invalid/missing values remain explicitly unavailable. */
export function formatAdminAuditLogsTimestamp(value: string, locale: string, timeZone?: string): string {
  if (!value || value.trim() === '—') return '—';
  const instant = new Date(value);
  if (Number.isNaN(instant.getTime())) return '—';
  try {
    // date-fns locale formatting is used for the supplied date; optional time-zone conversion remains host-owned.
    if (timeZone) return new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(instant);
    return format(instant, 'PPpp', { locale: locale === 'hi' ? hi : enIN });
  } catch { return '—'; }
}
