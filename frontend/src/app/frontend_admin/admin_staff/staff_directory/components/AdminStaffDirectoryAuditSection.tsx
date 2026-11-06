'use client';
// RESPONSIBILITY: AdminStaffDirectoryAuditSection component owned by admin_staff_directory; responsibility folder: admin_staff_directory_audit_section.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { ADMIN_STAFF_DIRECTORY_ACTIVITY_FIXTURES } from '@/app/frontend_admin/admin_staff/staff_directory/mocks/scenarios/admin_staff_directory.scenarios';
import type { AdminStaffDirectoryAuditSectionProps } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { AdminStaffDirectoryAuditSessionsView } from './AdminStaffDirectoryAuditSessionsView';
import { AdminStaffDirectoryAuditHistoryView } from './AdminStaffDirectoryAuditHistoryView';

/** Renders explicitly synthetic audit/activity panels only in demo mode; no API-backed audit endpoint is inferred. */
export default function AdminStaffDirectoryAuditSection({ tab }: AdminStaffDirectoryAuditSectionProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');

  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityPage, setActivityPage] = useState(0);
  const [activityPageSize, setActivityPageSize] = useState(10);

  const filteredActivity = useMemo(() => {
    if (!activitySearchQuery.trim()) return ADMIN_STAFF_DIRECTORY_ACTIVITY_FIXTURES;
    const q = activitySearchQuery.toLowerCase().trim();
    return ADMIN_STAFF_DIRECTORY_ACTIVITY_FIXTURES.filter(
      (a) => a.managerName.toLowerCase().includes(q) || a.actionKey.toLowerCase().includes(q)
    );
  }, [activitySearchQuery]);

  const paginatedActivity = useMemo(
    () => filteredActivity.slice(activityPage * activityPageSize, (activityPage + 1) * activityPageSize),
    [filteredActivity, activityPage, activityPageSize]
  );

  if (tab === 'sessions') {
    return <AdminStaffDirectoryAuditSessionsView />;
  }

  if (tab === 'history') {
    return <AdminStaffDirectoryAuditHistoryView />;
  }

  return (
    <section className="admin-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">{t('ACTIVITY_TITLE')}</h2>
        <div className="relative min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={activitySearchQuery}
            onChange={(e) => {
              setActivitySearchQuery(e.target.value);
              setActivityPage(0);
            }}
            placeholder="Search activity logs..."
            className="w-full rounded-lg border border-border bg-card py-1.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="divide-y divide-border">
        {paginatedActivity.length === 0 ? (
          <p className="p-6 text-center text-sm text-text-secondary">No activity logs found.</p>
        ) : (
          paginatedActivity.map((activity) => (
            <article key={`${activity.managerName}-${activity.timeKey}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-surface-hover motion-safe:transition-colors gap-2">
              <div>
                <p className="font-medium text-text-primary">{activity.managerName}</p>
                <p className="text-sm text-text-secondary">{t(activity.actionKey)}</p>
              </div>
              <time className="text-xs text-text-tertiary shrink-0">{t(activity.timeKey)}</time>
            </article>
          ))
        )}
      </div>
      {filteredActivity.length > 0 && (
        <AdminTablePagination
          page={activityPage}
          pageSize={activityPageSize}
          totalCount={filteredActivity.length}
          onPageChange={setActivityPage}
          onPageSizeChange={(newSize: number) => {
            setActivityPageSize(newSize);
            setActivityPage(0);
          }}
        />
      )}
    </section>
  );
}
