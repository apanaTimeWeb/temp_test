// RESPONSIBILITY: AdminSystemMaintenanceLockersSection component owned by admin_system; responsibility folder: admin_system_maintenance_page_sections.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Lock } from 'lucide-react';
import type { AdminSystemMaintenanceLockerFixture } from '@/app/frontend_admin/admin_system/system_maintenance/mocks/AdminSystemMaintenanceFixtures';
import type { AdminSystemMaintenanceLockersSectionProps } from '@/app/frontend_admin/admin_system/system_maintenance/types/AdminSystemMaintenanceComponentTypes';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';


export default function AdminSystemMaintenanceLockersSection({ lockers }: AdminSystemMaintenanceLockersSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_MAINTENANCE');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const paginatedLockers = useMemo(
    () => lockers.slice(page * pageSize, (page + 1) * pageSize),
    [lockers, page, pageSize]
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-text-primary"><Lock size={18} strokeWidth={2} className="text-primary" /> {t('LOCKERS')}</CardTitle>
        <CardDescription>{t('LOCKER_DESCRIPTION')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:hidden" aria-label={t('LOCKERS')}>
          {lockers.map((locker) => <article key={locker.id} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-semibold text-text-primary">{locker.id}</h3><AdminSystemBadge variant={locker.status === 'OK' ? 'success' : 'danger'}>{t(locker.status === 'OK' ? 'STATUS_OK' : 'STATUS_ISSUE_REPORTED')}</AdminSystemBadge></div>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2"><div><dt className="text-text-secondary">{t('LAST_REPORTED_ISSUE')}</dt><dd className="text-text-primary">{locker.issueDate ? `${t(locker.issueKey)} — ${locker.issueDate}` : t(locker.issueKey)}</dd></div></dl>
            <Button id={`update-locker-mobile-${locker.id}`} className="mt-3" variant="ghost" size="sm" disabled title={t('ACTION_BLOCKED')}>{t('UPDATE_STATUS_DEMO')}</Button>
          </article>)}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-max text-sm text-left">
            <thead>
              <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                <th scope="col" className="sticky left-0 z-10 bg-surface-highlight py-3 px-4 text-left">{t('LOCKER_NUMBER')}</th>
                <th scope="col" className="py-3 px-4 text-left">{t('STATUS')}</th>
                <th scope="col" className="py-3 px-4 text-left">{t('LAST_REPORTED_ISSUE')}</th>
                <th scope="col" className="py-3 px-4 text-left">{t('ACTION')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedLockers.map((locker) => (
                <tr key={locker.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
                  <td className="sticky left-0 z-[1] bg-inherit py-3 px-4 font-mono font-medium text-text-primary">{locker.id}</td>
                  <td className="py-3 px-4"><AdminSystemBadge variant={locker.status === 'OK' ? 'success' : 'danger'}>{t(locker.status === 'OK' ? 'STATUS_OK' : 'STATUS_ISSUE_REPORTED')}</AdminSystemBadge></td>
                  <td className="py-3 px-4 text-text-secondary">{locker.issueDate ? `${t(locker.issueKey)} — ${locker.issueDate}` : t(locker.issueKey)}</td>
                  <td className="py-3 px-4"><Button id={`update-locker-table-${locker.id}`} variant="ghost" size="sm" disabled title={t('ACTION_BLOCKED')}>{t('UPDATE_STATUS_DEMO')}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {lockers.length > 0 && (
            <AdminTablePagination
              page={page}
              pageSize={pageSize}
              totalCount={lockers.length}
              onPageChange={setPage}
              onPageSizeChange={(newSize: number) => {
                setPageSize(newSize);
                setPage(0);
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}


export type { AdminSystemMaintenanceLockersSectionProps };
