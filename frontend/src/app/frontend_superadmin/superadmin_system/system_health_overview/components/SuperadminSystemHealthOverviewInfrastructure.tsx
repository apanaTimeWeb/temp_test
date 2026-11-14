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
      <div className="sa-card p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-bold text-primary flex items-center gap-2"><Server size={20} className="text-info" aria-hidden="true" /> {t("COPY.COMPUTE_INFRASTRUCTURE")}</h2><span className="text-xs text-secondary">{t("COPY.SAMPLE_REGION_UNVERIFIED")}</span></div>
        <div className="space-y-5 flex-1">
          {SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE.map((node) => (
            <div key={node.id}>
              <div className="flex justify-between items-end mb-2"><div className="flex items-center gap-2"><Cpu size={14} className="text-secondary" aria-hidden="true" /><p className="text-sm font-bold text-primary">{t(node.nameKey)}</p></div><div className="flex items-center gap-3"><span className="text-xs font-mono text-disabled">{node.ping} {t("COPY.SAMPLE_PING")}</span><span className={`text-xs font-bold ${node.usage > 85 ? 'text-warning' : 'text-success'}`}>{node.usage}{t("COPY.SAMPLE_CPU")}</span></div></div>
              <progress className={`sa-health-progress ${node.usage > 85 ? 'sa-health-progress--warning' : 'sa-health-progress--success'}`} max={100} value={node.usage} aria-label={t("COPY.SAMPLE_USAGE_FOR_NAME", { name: t(node.nameKey) })} />
            </div>
          ))}
        </div>
      </div>
      <div className="sa-card p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-bold text-primary flex items-center gap-2"><Database size={20} className="text-info" aria-hidden="true" /> {t("COPY.DATABASE_STORAGE")}</h2><span className="text-xs text-secondary">{t("COPY.REPLICATION_STATUS_NOT_CONNECTED")}</span></div>
        <div className="space-y-5 flex-1">
          {SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE.map((node) => (
            <div key={node.id}><div className="flex justify-between items-end mb-2"><div className="flex items-center gap-2"><HardDrive size={14} className="text-secondary" aria-hidden="true" /><p className="text-sm font-bold text-primary">{t(node.nameKey)}</p></div><div className="flex items-center gap-3"><span className="text-xs text-secondary">{t(node.metricKey)}:</span><span className="text-xs font-bold text-info">{node.val}</span></div></div><progress className="sa-health-progress sa-health-progress--info" max={100} value={node.pct} aria-label={t("COPY.SAMPLE_STATUS_FOR_NAME", { name: t(node.nameKey) })} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}
