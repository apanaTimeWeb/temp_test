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
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" aria-label={t("COPY.SAMPLE_NETWORK_METRICS")}>
      {SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS.map((kpi) => {
        const MetricIcon = SUPERADMIN_SYSTEM_HEALTH_NETWORK_ICONS[kpi.id];
        const metricColor = SUPERADMIN_SYSTEM_HEALTH_NETWORK_COLORS[kpi.id];
        return (
          <div key={kpi.id} className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 ${metricColor}`}>
                <MetricIcon size={18} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">{t(kpi.trendKey)}</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{t(kpi.labelKey)}</p>
            <h3 className="text-2xl font-black text-slate-100">{kpi.value} <span className="text-sm text-slate-400 font-normal">{kpi.unit}</span></h3>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '75%' }} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
