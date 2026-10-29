import type { ManagerDashboardOverviewRecentEnquiry } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewTypes';

export function createManagerDashboardRecentEnquiryKeys(rows: ManagerDashboardOverviewRecentEnquiry[]): string[] {
  const occurrences = new Map<string, number>();
  return rows.map((row) => {
    const base = row.id?.trim() ? `id:${row.id.trim()}` : `fallback:${row.name.trim()}\u001f${row.phone}\u001f${row.status}`;
    const occurrence = (occurrences.get(base) ?? 0) + 1;
    occurrences.set(base, occurrence);
    return occurrence === 1 ? base : `${base}#${occurrence}`;
  });
}
