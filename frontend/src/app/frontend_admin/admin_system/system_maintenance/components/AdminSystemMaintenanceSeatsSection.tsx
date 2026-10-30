// RESPONSIBILITY: AdminSystemMaintenanceSeatsSection component owned by admin_system; responsibility folder: admin_system_maintenance_page_sections.
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Wrench } from 'lucide-react';
import type { AdminSystemMaintenanceSeatFixture } from '@/app/frontend_admin/admin_system/system_maintenance/mocks/AdminSystemMaintenanceFixtures';
import type { AdminSystemMaintenanceSeatsSectionProps } from '@/app/frontend_admin/admin_system/system_maintenance/types/AdminSystemMaintenanceComponentTypes';


export default function AdminSystemMaintenanceSeatsSection({ seats }: AdminSystemMaintenanceSeatsSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_MAINTENANCE');
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-text-primary"><Wrench size={18} strokeWidth={2} className="text-primary" /> {t('SEATS')}</CardTitle>
        <CardDescription>{t('SEAT_DESCRIPTION')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:hidden" aria-label={t('SEATS')}>
          {seats.map((seat) => (
            <article key={seat.id} className="rounded-lg border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-text-primary">{seat.id}</h3>
                <AdminSystemBadge variant={seat.status === 'OK' ? 'success' : 'danger'}>{t(seat.status === 'OK' ? 'STATUS_OK' : 'STATUS_NEEDS_ATTENTION')}</AdminSystemBadge>
              </div>
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div><dt className="text-text-secondary">{t('LAST_MAINTENANCE')}</dt><dd className="text-text-primary">{seat.lastMaint}</dd></div>
                <div><dt className="text-text-secondary">{t('DAYS_SINCE')}</dt><dd className={seat.daysSince > 30 ? 'font-semibold text-danger-text' : 'text-text-primary'}>{seat.daysSince}{t('DAYS_ABBR')}</dd></div>
              </dl>
              <Button id={`log-seat-maint-${seat.id}`} className="mt-3" variant="ghost" size="sm" disabled title={t('ACTION_BLOCKED')}>{t('LOG_MAINTENANCE_DEMO')}</Button>
            </article>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-max text-sm">
            <thead><tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wide">
              <th scope="col" className="sticky left-0 z-10 bg-surface-highlight py-3 pr-4 text-left">{t('SEAT_NUMBER')}</th>
              <th scope="col" className="py-3 pr-4 text-left">{t('STATUS')}</th>
              <th scope="col" className="py-3 pr-4 text-left">{t('LAST_MAINTENANCE')}</th>
              <th scope="col" className="py-3 pr-4 text-left">{t('DAYS_SINCE')}</th>
              <th scope="col" className="py-3 text-left">{t('ACTION')}</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {seats.map((seat) => <tr key={seat.id} className="hover:bg-surface-hover motion-safe:transition-colors motion-safe:duration-fast">
                <td className="sticky left-0 z-[1] bg-card py-3 pr-4 font-mono font-medium text-text-primary">{seat.id}</td>
                <td className="py-3 pr-4"><AdminSystemBadge variant={seat.status === 'OK' ? 'success' : 'danger'}>{t(seat.status === 'OK' ? 'STATUS_OK' : 'STATUS_NEEDS_ATTENTION')}</AdminSystemBadge></td>
                <td className="py-3 pr-4 text-text-secondary">{seat.lastMaint}</td>
                <td className="py-3 pr-4"><span className={seat.daysSince > 30 ? 'font-semibold text-danger-text' : 'text-text-secondary'}>{seat.daysSince}{t('DAYS_ABBR')}</span></td>
                <td className="py-3"><Button id={`log-seat-maint-table-${seat.id}`} variant="ghost" size="sm" disabled title={t('ACTION_BLOCKED')}>{t('LOG_MAINTENANCE_DEMO')}</Button></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}


export type { AdminSystemMaintenanceSeatsSectionProps };
