// RESPONSIBILITY: AdminSystemMaintenanceLockersSection component owned by admin_system; responsibility folder: admin_system_maintenance_page_sections.
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


export default function AdminSystemMaintenanceLockersSection({ lockers }: AdminSystemMaintenanceLockersSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_MAINTENANCE');
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
          <table className="w-full min-w-max text-sm">
            <thead><tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wide">
              <th scope="col" className="sticky left-0 z-10 bg-surface-highlight py-3 pr-4 text-left">{t('LOCKER_NUMBER')}</th>
              <th scope="col" className="py-3 pr-4 text-left">{t('STATUS')}</th><th scope="col" className="py-3 pr-4 text-left">{t('LAST_REPORTED_ISSUE')}</th><th scope="col" className="py-3 text-left">{t('ACTION')}</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {lockers.map((locker) => <tr key={locker.id} className="hover:bg-surface-hover motion-safe:transition-colors motion-safe:duration-fast">
                <td className="sticky left-0 z-[1] bg-card py-3 pr-4 font-mono font-medium text-text-primary">{locker.id}</td>
                <td className="py-3 pr-4"><AdminSystemBadge variant={locker.status === 'OK' ? 'success' : 'danger'}>{t(locker.status === 'OK' ? 'STATUS_OK' : 'STATUS_ISSUE_REPORTED')}</AdminSystemBadge></td>
                <td className="py-3 pr-4 text-text-secondary">{locker.issueDate ? `${t(locker.issueKey)} — ${locker.issueDate}` : t(locker.issueKey)}</td>
                <td className="py-3"><Button id={`update-locker-table-${locker.id}`} variant="ghost" size="sm" disabled title={t('ACTION_BLOCKED')}>{t('UPDATE_STATUS_DEMO')}</Button></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}


export type { AdminSystemMaintenanceLockersSectionProps };
