// RESPONSIBILITY: AdminSystemAutoScalePage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { BarChart3, ChevronRight } from 'lucide-react';
import { AdminSystemAutoScaleSchema, type AdminSystemAutoScaleFormValues } from '@/app/frontend_admin/admin_system/system_auto_scale/schemas/AdminSystemAutoScaleSchema';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_SYSTEM_URLS } from '@/app/frontend_admin/admin_system/system_auto_scale/config/admin_system_auto_scale_system_url_config_source_routes';
import { ADMIN_SYSTEM_AUTO_SCALE_FIXTURES } from '@/app/frontend_admin/admin_system/system_auto_scale/mocks/scenarios/admin_system_auto_scale.scenarios';
import AdminSystemAutoScaleKpisSection from '@/app/frontend_admin/admin_system/system_auto_scale/components/AdminSystemAutoScaleKpisSection';
import AdminSystemAutoScaleThresholdsSection from '@/app/frontend_admin/admin_system/system_auto_scale/components/AdminSystemAutoScaleThresholdsSection';
import AdminSystemAutoScaleRecommendationsSection, { type AdminSystemAutoScaleRecommendation } from '@/app/frontend_admin/admin_system/system_auto_scale/components/AdminSystemAutoScaleRecommendationsSection';

export function AdminSystemAutoScalePage() {
  const t = useTranslations('ADMIN_SYSTEM_AUTO_SCALE');
  const router = useRouter();
  const form = useForm<AdminSystemAutoScaleFormValues>({ resolver: zodResolver(AdminSystemAutoScaleSchema), defaultValues: { seatThreshold: 90, lockerThreshold: 85, alertEnabled: true } });
  const values = form.watch();
  const isDemoMode = isFrontendDemoModeEnabled();
  if (!isDemoMode) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1><p role="status" className="text-warning-text">{t('LIVE_UNAVAILABLE')}</p></section>;
  const { seatOccupancy, lockerOccupancy } = ADMIN_SYSTEM_AUTO_SCALE_FIXTURES;
  const recommendations: AdminSystemAutoScaleRecommendation[] = [
    seatOccupancy > values.seatThreshold
      ? { id: 'seats', variant: 'danger', label: t('SEATS'), message: t('RECOMMEND_ADD_SEATS', { occupancy: seatOccupancy }), action: t('ACTION_ADD_SEATS'), route: ADMIN_SYSTEM_URLS.ROUTE_SEAT_MANAGEMENT }
      : seatOccupancy < 40
        ? { id: 'seats', variant: 'warning', label: t('SEATS'), message: t('RECOMMEND_LOW_SEATS'), action: t('POWER_SAVING'), route: ADMIN_SYSTEM_URLS.ROUTE_POWER_SAVING }
        : { id: 'seats', variant: 'success', label: t('SEATS'), message: t('RECOMMEND_HEALTHY_SEATS', { occupancy: seatOccupancy }), action: null, route: null },
    lockerOccupancy < 40
      ? { id: 'lockers', variant: 'warning', label: t('LOCKERS'), message: t('RECOMMEND_LOW_LOCKERS', { occupancy: lockerOccupancy }), action: null, route: null }
      : lockerOccupancy > values.lockerThreshold
        ? { id: 'lockers', variant: 'danger', label: t('LOCKERS'), message: t('RECOMMEND_CAPACITY_LOCKERS'), action: t('ACTION_MANAGE_LOCKERS'), route: ADMIN_SYSTEM_URLS.ROUTE_LOCKER_MATRIX }
        : { id: 'lockers', variant: 'success', label: t('LOCKERS'), message: t('RECOMMEND_HEALTHY_LOCKERS', { occupancy: lockerOccupancy }), action: null, route: null },
  ];
  return (
    <div className="space-y-0">
      <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_NOTICE')}</p>
      <p role="status" className="mb-4 text-sm text-text-secondary">{t('SAVE_BLOCKED')}</p>
      <header className="mb-8">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-text-secondary"><span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('BREADCRUMB_AUTO_SCALE')}</span></div>
        <h1 className="flex items-center gap-3 text-page-title font-bold text-text-primary"><BarChart3 size={18} strokeWidth={2} />{t('TITLE')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('SUBTITLE')}</p>
      </header>
      <AdminSystemAutoScaleKpisSection />
      <AdminSystemAutoScaleThresholdsSection form={form} />
      <AdminSystemAutoScaleRecommendationsSection recommendations={recommendations} onNavigate={(route) => router.push(route)} />
    </div>
  );
}
