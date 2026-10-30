// RESPONSIBILITY: AdminSystemMaintenancePage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
import { AdminSystemKpiCard } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveKpiCard';
import { Wrench, ChevronRight } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { getAdminSystemMaintenanceFixtures } from '@/app/frontend_admin/admin_system/system_maintenance/mocks/AdminSystemMaintenanceFixtures';
import AdminSystemMaintenanceSeatsSection from '@/app/frontend_admin/admin_system/system_maintenance/components/AdminSystemMaintenanceSeatsSection';
import AdminSystemMaintenanceAssetsSection from '@/app/frontend_admin/admin_system/system_maintenance/components/AdminSystemMaintenanceAssetsSection';
import AdminSystemMaintenanceLockersSection from '@/app/frontend_admin/admin_system/system_maintenance/components/AdminSystemMaintenanceLockersSection';

/** Orchestrates the maintenance page; each table/card section owns its responsive presentation. */
export function AdminSystemMaintenancePage() {
  const t = useTranslations('ADMIN_SYSTEM_MAINTENANCE');
  const { seats, assets, lockers } = getAdminSystemMaintenanceFixtures();
  const isDemoMode = isFrontendDemoModeEnabled();

  if (!isDemoMode) {
    return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-page-title font-bold text-text-primary">{t('LIVE_UNAVAILABLE_TITLE')}</h1><p role="status" className="text-warning-text">{t('LIVE_UNAVAILABLE_DESCRIPTION')}</p></section>;
  }

  const seatsNeedingAttention = seats.filter((seat) => seat.status === 'Needs Attention').length;
  const assetsOverdue = assets.filter((asset) => asset.daysOverdue > 0).length;
  const lockerIssues = lockers.filter((locker) => locker.status === 'Issue Reported').length;

  return (
    <div>
      <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_NOTICE')}</p>
      <p role="status" className="mb-4 text-sm text-text-secondary">{t('ACTION_BLOCKED')}</p>
      <header className="mb-8">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-text-secondary"><span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('BREADCRUMB_MAINTENANCE')}</span></div>
        <h1 className="flex items-center gap-3 text-page-title font-bold text-text-primary"><Wrench size={18} strokeWidth={2} className="text-primary" />{t('TITLE')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('SUBTITLE')}</p>
      </header>
      <section aria-label={t('SUMMARY')} className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <AdminSystemKpiCard title={t('KPI_SEATS_ATTENTION')} value={seatsNeedingAttention} icon="🪑" trend="down" trendLabel={t('KPI_ACTION_REQUIRED')} />
        <AdminSystemKpiCard title={t('KPI_ASSETS_OVERDUE')} value={assetsOverdue} icon="⚙️" trend="down" trendLabel={t('KPI_SERVICE_OVERDUE')} />
        <AdminSystemKpiCard title={t('KPI_LOCKER_ISSUES')} value={lockerIssues} icon="🔒" trend="down" trendLabel={t('KPI_REPORTED_ISSUES')} />
      </section>
      <AdminSystemMaintenanceSeatsSection seats={seats} />
      <AdminSystemMaintenanceAssetsSection assets={assets} />
      <AdminSystemMaintenanceLockersSection lockers={lockers} />
    </div>
  );
}
