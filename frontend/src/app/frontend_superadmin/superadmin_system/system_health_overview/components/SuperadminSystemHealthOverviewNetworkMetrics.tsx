/** Responsibility: Superadmin System Health Network Metrics; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSystemHealthOverviewNetworkMetrics formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/mocks/fixtures/SuperadminSystemHealthOverviewMockFixtures';
import { SUPERADMIN_SYSTEM_HEALTH_NETWORK_COLORS, SUPERADMIN_SYSTEM_HEALTH_NETWORK_ICONS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/constants/SuperadminSystemHealthOverviewConstants';
import { useTranslations } from 'next-intl';

/**
 * Performs the superadmin system health overview network metrics operation within system health overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminSystemHealthOverviewNetworkMetrics() {
  const t = useTranslations('SUPERADMIN_SYSTEM_HEALTH');
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" aria-label={t("COPY.SAMPLE_NETWORK_METRICS")}>
      {SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS.map((kpi) => {
        const MetricIcon = SUPERADMIN_SYSTEM_HEALTH_NETWORK_ICONS[kpi.id];
        const metricColor = SUPERADMIN_SYSTEM_HEALTH_NETWORK_COLORS[kpi.id];
        return (
          <div key={kpi.id} className="sa-card p-5 border border-border bg-surface-highlight">
            <div className="flex justify-between items-start mb-4"><div className={`p-2 rounded-lg bg-surface-hover ${metricColor}`}><MetricIcon size={20} aria-hidden="true" /></div><span className="text-xs font-bold px-2 py-1 bg-surface-hover text-secondary rounded-full">{t(kpi.trendKey)}</span></div>
            <p className="text-xs text-secondary font-medium uppercase tracking-wider mb-1">{t(kpi.labelKey)}</p>
            <h3 className="text-2xl font-bold text-primary">{kpi.value} <span className="text-sm text-disabled font-normal">{kpi.unit}</span></h3>
          </div>
        );
      })}
    </section>
  );
}
