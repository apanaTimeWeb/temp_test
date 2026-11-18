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
      {/* API Integrations */}
      <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 p-6 shadow-lg">
        <h2 className="text-sm font-bold text-slate-100 mb-5 flex items-center gap-2">
          <Globe size={18} className="text-rose-400" aria-hidden="true" /> {t("COPY.API_INTEGRATIONS_WEBHOOKS")}
        </h2>
        <div className="grid gap-3">
          {SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS.map((api) => {
            const IntegrationIcon = SUPERADMIN_SYSTEM_HEALTH_INTEGRATION_ICONS[api.id];
            return (
              <div key={api.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-rose-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400"><IntegrationIcon size={16} aria-hidden="true" /></div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{t(api.nameKey)}</h3>
                    <p className="text-[11px] text-slate-400">{t("COPY.UPTIME")} {api.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-[11px] font-bold text-amber-400">
                    <AlertTriangle size={11} aria-hidden="true" />{t(api.statusKey)}
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{api.latency} {t("COPY.PING")}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Cron Jobs */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-900/90 p-6 shadow-lg">
        <h2 className="text-sm font-bold text-slate-100 mb-5 flex items-center gap-2">
          <RefreshCw size={18} className="text-amber-400" aria-hidden="true" /> {t("COPY.BACKGROUND_TASKS_CRON")}
        </h2>
        <div className="grid gap-3">
          {SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS.map((job) => (
            <div key={job.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-amber-500/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-bold text-slate-200">{t(job.nameKey)}</h3>
                <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300">{t(job.statusKey)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Clock size={11} aria-hidden="true" /> {t(job.scheduleKey)}</span>
                <span>{t("COPY.LAST_RUN")} <strong className="text-slate-300">{t(job.lastRunKey)}</strong></span>
                <span>{t("COPY.TOOK")} <strong className="text-slate-300">{job.duration}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
