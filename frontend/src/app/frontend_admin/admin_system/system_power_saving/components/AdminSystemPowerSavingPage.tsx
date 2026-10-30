// RESPONSIBILITY: AdminSystemPowerSavingPage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Input } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveInput';
import { Label } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveLabel';
import { AdminSystemSwitch } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveSwitch';
import { Zap, ChevronRight } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminSystemPowerSavingZonesSection from '@/app/frontend_admin/admin_system/system_power_saving/components/AdminSystemPowerSavingZonesSection';
import AdminSystemPowerSavingAlertLogSection from '@/app/frontend_admin/admin_system/system_power_saving/components/AdminSystemPowerSavingAlertLogSection';

export function AdminSystemPowerSavingPage() {
  const t = useTranslations('ADMIN_SYSTEM_POWER_SAVING');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [threshold, setThreshold] = useState(30);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  if (!isDemoMode) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-page-title font-bold text-text-primary">{t('LIVE_UNAVAILABLE_TITLE')}</h1><p role="status" className="text-warning-text">{t('LIVE_UNAVAILABLE_DESCRIPTION')}</p></section>;

  return (
    <div>
      <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_NOTICE')}</p>
      <p role="status" className="mb-4 text-sm text-text-secondary">{t('SAVE_BLOCKED')}</p>
      <header className="mb-8">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-text-secondary"><span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('BREADCRUMB_POWER_SAVING')}</span></div>
        <h1 className="flex items-center gap-3 text-page-title font-bold text-text-primary"><Zap size={18} strokeWidth={2} className="text-primary" />{t('TITLE')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('SUBTITLE')}</p>
      </header>

      <Card className="mb-6">
        <CardHeader><CardTitle>{t('CONFIGURATION')}</CardTitle><CardDescription>{t('CONFIG_DESCRIPTION')}</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Label htmlFor="power-threshold">{t('OCCUPANCY_THRESHOLD')}</Label><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><Input id="power-threshold" type="number" value={threshold} onChange={(event) => setThreshold(Math.min(95, Math.max(5, Number(event.target.value) || 5)))} className="w-full sm:w-28" min={5} max={95} /><span className="text-sm text-text-secondary">{t('OCCUPANCY_BELOW_PREFIX')}<strong className="text-primary">{threshold}{t('PERCENT_SUFFIX')}</strong>{t('OCCUPANCY_BELOW_SUFFIX')}</span></div></div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4"><div><p className="text-sm font-medium text-text-primary">{t('ENABLE_ALERTS')}</p><p className="text-xs text-text-secondary">{t('ALERTS_HELP')}</p></div><AdminSystemSwitch id="power-saving-toggle" aria-label={t('ENABLE_ALERTS_ARIA')} checked={alertsEnabled} onCheckedChange={setAlertsEnabled} /></div>
        </CardContent>
        <CardFooter><Button id="save-power-config-btn" variant="primary" disabled title={t('SAVE_BLOCKED')}>{t('SAVE_DEMO')}</Button></CardFooter>
      </Card>
      <AdminSystemPowerSavingZonesSection threshold={threshold} />
      <AdminSystemPowerSavingAlertLogSection />
    </div>
  );
}
