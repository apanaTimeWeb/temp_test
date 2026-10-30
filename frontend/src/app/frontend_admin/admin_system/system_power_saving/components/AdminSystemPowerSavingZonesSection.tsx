// RESPONSIBILITY: AdminSystemPowerSavingZonesSection component owned by admin_system; responsibility folder: admin_system_power_saving_page_sections.
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { AdminSystemProgress } from '@/app/frontend_admin/admin_system/system_power_saving/components/AdminSystemPowerSavingProgress';
import { ADMIN_SYSTEM_POWER_SAVING_ZONE_FIXTURES as ZONES } from '@/app/frontend_admin/admin_system/system_power_saving/mocks/AdminSystemPowerSavingFixtures';
import type { AdminSystemPowerSavingZonesSectionProps } from '@/app/frontend_admin/admin_system/system_power_saving/types/AdminSystemPowerSavingComponentTypes';


export default function AdminSystemPowerSavingZonesSection({ threshold }: AdminSystemPowerSavingZonesSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_POWER_SAVING');
  return (
    <section aria-label={t('ZONE_STATUS_SECTION_ARIA')} className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {ZONES.map((zone) => {
        const isLow = zone.occupancy < threshold;
        return (
          <Card key={zone.name}>
            <CardContent>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div><p className="text-sm font-semibold text-text-primary">{zone.name}</p><p className="text-xs text-text-secondary">{zone.current} / {zone.capacity} {t('SEATS_OCCUPIED')}</p></div>
                <AdminSystemBadge variant={isLow ? 'warning' : 'success'}>{isLow ? t('LOW_CONSOLIDATION_STATUS') : t('NORMAL_STATUS')}</AdminSystemBadge>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-text-secondary"><span>{t('OCCUPANCY')}</span><span className={isLow ? 'font-semibold text-text-secondary' : 'font-semibold text-success-text'}>{zone.occupancy}{t('PERCENT_SUFFIX')}</span></div>
                <AdminSystemProgress value={zone.occupancy} barClassName={isLow ? 'bg-surface-highlight' : 'bg-success-bg'} />
              </div>
              {isLow && <div className="mt-3 rounded-lg border border-border bg-surface-highlight p-2.5 text-xs text-text-secondary">{t('SUGGESTED_CONSOLIDATION')} {zone.name} {t('AC')}</div>}
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}


export type { AdminSystemPowerSavingZonesSectionProps };
