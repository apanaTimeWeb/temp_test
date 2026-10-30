// RESPONSIBILITY: AdminSystemPowerSavingAlertLogSection component owned by admin_system; responsibility folder: admin_system_power_saving_page_sections.
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { ADMIN_SYSTEM_POWER_SAVING_ALERT_FIXTURES as ALERT_LOG } from '@/app/frontend_admin/admin_system/system_power_saving/mocks/AdminSystemPowerSavingFixtures';

export default function AdminSystemPowerSavingAlertLogSection() {
  const t = useTranslations('ADMIN_SYSTEM_POWER_SAVING');
  return (
    <Card>
      <CardHeader><CardTitle>{t('ALERT_LOG')}</CardTitle><CardDescription>{t('ALERT_LOG_DESCRIPTION')}</CardDescription></CardHeader>
      <CardContent>
        <div className="space-y-3 md:hidden">
          {ALERT_LOG.map((log) => <article key={`${log.date}-${log.zone}-${log.shift}`} className="space-y-2 rounded-lg border border-border bg-card p-4" aria-label={`${log.zone} ${t('ALERT_LOG')}`}>
            <div className="flex items-start justify-between gap-3"><p className="font-medium text-text-primary">{log.zone}</p><AdminSystemBadge variant="warning">{t('LESS_THAN')} {log.threshold}</AdminSystemBadge></div>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-xs text-text-secondary">{t('DATE')}</dt><dd className="text-text-primary">{log.date}</dd></div>
              <div><dt className="text-xs text-text-secondary">{t('SHIFT')}</dt><dd className="text-text-primary">{log.shift}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs text-text-secondary">{t('ACTION_TAKEN')}</dt><dd className="text-text-secondary">{log.action}</dd></div>
            </dl>
          </article>)}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-max text-sm">
            <thead><tr className="border-b border-border text-xs uppercase tracking-wide text-text-secondary"><th scope="col" className="sticky left-0 z-10 bg-surface-highlight py-3 pr-4 text-left">{t('DATE')}</th><th scope="col" className="py-3 pr-4 text-left">{t('SHIFT')}</th><th scope="col" className="py-3 pr-4 text-left">{t('ZONE')}</th><th scope="col" className="py-3 pr-4 text-left">{t('THRESHOLD_BREACHED')}</th><th scope="col" className="py-3 text-left">{t('ACTION_TAKEN')}</th></tr></thead>
            <tbody className="divide-y divide-border">{ALERT_LOG.map((log) => <tr key={`${log.date}-${log.zone}-${log.shift}`} className="group hover:bg-surface-hover motion-safe:transition-colors motion-safe:duration-base"><td className="sticky left-0 z-[1] bg-card py-3 pr-4 text-text-secondary group-hover:bg-surface-hover">{log.date}</td><td className="py-3 pr-4 text-text-primary">{log.shift}</td><td className="py-3 pr-4 text-text-primary">{log.zone}</td><td className="py-3 pr-4"><AdminSystemBadge variant="warning">{t('LESS_THAN')} {log.threshold}</AdminSystemBadge></td><td className="py-3 text-text-secondary">{log.action}</td></tr>)}</tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
