// RESPONSIBILITY: AdminSystemAutoScaleKpisSection component owned by admin_system; responsibility folder: admin_system_auto_scale_page_sections.
import { useTranslations } from 'next-intl';
import { AdminSystemKpiCard } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveKpiCard';
import { ADMIN_SYSTEM_AUTO_SCALE_FIXTURES } from '@/app/frontend_admin/admin_system/system_auto_scale/mocks/scenarios/admin_system_auto_scale.scenarios';

export default function AdminSystemAutoScaleKpisSection() {
  const t = useTranslations('ADMIN_SYSTEM_AUTO_SCALE');
  const { totalSeats, totalLockers, averageOccupancy, peakDayValueKey } = ADMIN_SYSTEM_AUTO_SCALE_FIXTURES;
  return (
    <section aria-label={t('KPI_SECTION_ARIA')} className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      <AdminSystemKpiCard title={t('KPI_TOTAL_SEATS')} value={totalSeats} icon="🪑" subtitle={t('TOTAL_SEATS_SUBTITLE')} />
      <AdminSystemKpiCard title={t('KPI_TOTAL_LOCKERS')} value={totalLockers} icon="🔒" subtitle={t('TOTAL_LOCKERS_SUBTITLE')} />
      <AdminSystemKpiCard title={t('KPI_AVG_OCCUPANCY')} value={averageOccupancy} icon="📈" trend="up" trendLabel={t('OCCUPANCY_TREND')} />
      <AdminSystemKpiCard title={t('KPI_PEAK_DAY')} value={t(peakDayValueKey)} icon="🏆" subtitle={t('PEAK_DAY_SUBTITLE')} />
    </section>
  );
}
