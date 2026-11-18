/** Responsibility: Superadmin System Health Infrastructure; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSystemHealthOverviewInfrastructure formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { Database, Server, Cpu, HardDrive } from 'lucide-react';
import { SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE, SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/mocks/fixtures/SuperadminSystemHealthOverviewMockFixtures';
import { useTranslations } from 'next-intl';

/**
 * Performs the superadmin system health overview infrastructure operation within system health overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminSystemHealthOverviewInfrastructure() {
  const t = useTranslations('SUPERADMIN_SYSTEM_HEALTH');
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" aria-label={t("COPY.SAMPLE_INFRASTRUCTURE_RESOURCES")}>
      {/* Compute */}
      <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 via-slate-900/90 to-slate-900/90 p-6 shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Server size={18} className="text-sky-400" aria-hidden="true" /> {t("COPY.COMPUTE_INFRASTRUCTURE")}
          </h2>
          <span className="text-xs text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-lg">{t("COPY.SAMPLE_REGION_UNVERIFIED")}</span>
        </div>
        <div className="space-y-4 flex-1">
          {SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE.map((node) => (
            <div key={node.id}>
              <div className="flex justify-between items-end mb-1.5">
                <div className="flex items-center gap-2"><Cpu size={13} className="text-sky-400" aria-hidden="true" /><p className="text-xs font-semibold text-slate-200">{t(node.nameKey)}</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{node.ping} {t("COPY.SAMPLE_PING")}</span>
                  <span className={`text-xs font-bold ${node.usage > 85 ? 'text-amber-400' : 'text-emerald-400'}`}>{node.usage}{t("COPY.SAMPLE_CPU")}</span>
                </div>
              </div>
              <progress className={`sa-health-progress ${node.usage > 85 ? 'sa-health-progress--warning' : 'sa-health-progress--success'}`} max={100} value={node.usage} aria-label={t("COPY.SAMPLE_USAGE_FOR_NAME", { name: t(node.nameKey) })} />
            </div>
          ))}
        </div>
      </div>
      {/* Database */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/90 p-6 shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Database size={18} className="text-indigo-400" aria-hidden="true" /> {t("COPY.DATABASE_STORAGE")}
          </h2>
          <span className="text-xs text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-lg">{t("COPY.REPLICATION_STATUS_NOT_CONNECTED")}</span>
        </div>
        <div className="space-y-4 flex-1">
          {SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE.map((node) => (
            <div key={node.id}>
              <div className="flex justify-between items-end mb-1.5">
                <div className="flex items-center gap-2"><HardDrive size={13} className="text-indigo-400" aria-hidden="true" /><p className="text-xs font-semibold text-slate-200">{t(node.nameKey)}</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{t(node.metricKey)}:</span>
                  <span className="text-xs font-bold text-indigo-300">{node.val}</span>
                </div>
              </div>
              <progress className="sa-health-progress sa-health-progress--info" max={100} value={node.pct} aria-label={t("COPY.SAMPLE_STATUS_FOR_NAME", { name: t(node.nameKey) })} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
