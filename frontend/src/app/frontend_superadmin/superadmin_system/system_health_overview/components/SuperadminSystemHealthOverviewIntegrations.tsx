/** Responsibility: Superadmin System Health Integrations; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSystemHealthOverviewIntegrations formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { AlertTriangle, Clock, Globe, RefreshCw } from 'lucide-react';
import { SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS, SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/mocks/fixtures/SuperadminSystemHealthOverviewMockFixtures';
import { SUPERADMIN_SYSTEM_HEALTH_INTEGRATION_ICONS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/constants/SuperadminSystemHealthOverviewConstants';
import { useTranslations } from 'next-intl';

/**
 * Performs the superadmin system health overview integrations operation within system health overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminSystemHealthOverviewIntegrations() {
  const t = useTranslations('SUPERADMIN_SYSTEM_HEALTH');
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label={t("COPY.SAMPLE_INTEGRATIONS_AND_BACKGROUND_JOBS")}>
      <div className="sa-card p-6 border-border"><h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2"><Globe size={20} className="text-danger" aria-hidden="true" /> {t("COPY.API_INTEGRATIONS_WEBHOOKS")}</h2>
        <div className="grid gap-3">{SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS.map((api) => { const IntegrationIcon = SUPERADMIN_SYSTEM_HEALTH_INTEGRATION_ICONS[api.id]; return (
          <div key={api.id} className="flex items-center justify-between p-4 rounded-xl bg-floating border border-border hover:border-border motion-safe:transition-colors motion-reduce:transition-none"><div className="flex items-center gap-4"><div className="p-2 rounded-lg bg-surface-hover text-secondary"><IntegrationIcon size={18} aria-hidden="true" /></div><div><h3 className="text-sm font-bold text-primary">{t(api.nameKey)}</h3><p className="text-xs text-secondary mt-0.5">{t("COPY.UPTIME")} {api.uptime}</p></div></div><div className="text-right"><div className="flex items-center gap-1.5 justify-end text-xs font-bold uppercase text-warning"><AlertTriangle size={12} aria-hidden="true" />{t(api.statusKey)}</div><p className="text-xs font-mono text-disabled mt-1">{api.latency} {t("COPY.PING")}</p></div></div>
        ); })}</div>
      </div>
      <div className="sa-card p-6 border-border"><h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2"><RefreshCw size={20} className="text-warning" aria-hidden="true" /> {t("COPY.BACKGROUND_TASKS_CRON")}</h2>
        <div className="grid gap-3">{SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS.map((job) => (
          <div key={job.id} className="flex flex-col justify-center p-3 rounded-xl bg-floating border border-border"><div className="flex justify-between items-start mb-2"><h3 className="text-sm font-bold text-primary">{t(job.nameKey)}</h3><span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-warning-bg text-warning border border-border">{t(job.statusKey)}</span></div><div className="flex flex-wrap items-center gap-4 text-xs"><span className="text-secondary flex items-center gap-1"><Clock size={12} aria-hidden="true" /> {t(job.scheduleKey)}</span><span className="text-secondary">{t("COPY.LAST_RUN")} <strong className="text-secondary">{t(job.lastRunKey)}</strong></span><span className="text-secondary">{t("COPY.TOOK")} <strong className="text-secondary">{job.duration}</strong></span></div></div>
        ))}</div>
      </div>
    </section>
  );
}
