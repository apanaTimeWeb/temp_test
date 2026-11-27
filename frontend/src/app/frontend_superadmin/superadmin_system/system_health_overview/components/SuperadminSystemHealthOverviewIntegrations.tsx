'use client';
import { useState } from 'react';
import { AlertTriangle, Clock, Globe, RefreshCw, CheckCircle2, Play, Send } from 'lucide-react';
import { SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS, SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/mocks/fixtures/SuperadminSystemHealthOverviewMockFixtures';
import { SUPERADMIN_SYSTEM_HEALTH_INTEGRATION_ICONS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/constants/SuperadminSystemHealthOverviewConstants';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function SuperadminSystemHealthOverviewIntegrations() {
  const t = useTranslations('SUPERADMIN_SYSTEM_HEALTH');
  const [integrations, setIntegrations] = useState(SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS);
  const [cronJobs, setCronJobs] = useState(SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);

  const handleTestIntegration = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      const ping = Math.floor(Math.random() * 40 + 20) + 'ms';
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'Operational', latency: ping, uptime: '99.98%' }
            : item
        )
      );
      setTestingId(null);
      toast.success(`${name}: Handshake successful (HTTP 200 in ${ping})`, {
        id: `superadmin:system_health:integration-ping:${id}`,
      });
    }, 500);
  };

  const handleRunCron = (id: string, name: string) => {
    setRunningJobId(id);
    setTimeout(() => {
      const duration = (Math.random() * 1.5 + 0.2).toFixed(2) + 's';
      setCronJobs((prev) =>
        prev.map((job) =>
          job.id === id
            ? {
                ...job,
                status: 'Completed',
                lastRun: 'Just now',
                duration,
              }
            : job
        )
      );
      setRunningJobId(null);
      toast.success(`Cron Task executed: ${name} finished in ${duration}`, {
        id: `superadmin:system_health:cron-run:${id}`,
      });
    }, 600);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label={t("COPY.SAMPLE_INTEGRATIONS_AND_BACKGROUND_JOBS")}>
      {/* API Integrations */}
      <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/40 via-[#0a0d24] to-[#070914] p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe size={18} className="text-rose-400" aria-hidden="true" />
              <span>{t("COPY.API_INTEGRATIONS_WEBHOOKS")}</span>
            </h2>
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
              Verified Webhook Endpoints
            </span>
          </div>

          <div className="grid gap-3">
            {integrations.map((api) => {
              const IntegrationIcon = SUPERADMIN_SYSTEM_HEALTH_INTEGRATION_ICONS[api.id];
              const isTesting = testingId === api.id;
              const isOperational = api.status === 'Operational';

              return (
                <div
                  key={api.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/30 motion-safe:transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
                      <IntegrationIcon size={16} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">{t(api.nameKey)}</h3>
                      <p className="text-[11px] text-slate-400">
                        {t("COPY.UPTIME")} <strong className="text-slate-300">{api.uptime}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-left sm:text-right">
                      <div
                        className={`flex items-center gap-1 text-[11px] font-bold whitespace-nowrap ${
                          isOperational ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {isOperational ? (
                          <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle size={12} className="shrink-0" />
                        )}
                        <span className="whitespace-nowrap">{isOperational ? 'Operational' : t(api.statusKey)}</span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5 whitespace-nowrap">
                        {api.latency === '—' ? 'Latency: —' : `${api.latency} ${t("COPY.PING")}`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTestIntegration(api.id, t(api.nameKey))}
                      disabled={isTesting}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold motion-safe:transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 whitespace-nowrap shrink-0"
                    >
                      <RefreshCw size={11} className={isTesting ? 'motion-safe:animate-spin' : ''} />
                      <span>{isTesting ? 'Testing...' : t("COPY.TEST_CONNECTION")}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Webhook Retries: <strong className="text-rose-300">Exponential Backoff (3 max)</strong></span>
          <span className="text-emerald-400">0 dropped webhooks</span>
        </div>
      </div>

      {/* Cron Jobs */}
      <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/40 via-[#0a0d24] to-[#070914] p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <RefreshCw size={18} className="text-amber-400" aria-hidden="true" />
              <span>{t("COPY.BACKGROUND_TASKS_CRON")}</span>
            </h2>
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
              Queue Scheduler Healthy
            </span>
          </div>

          <div className="grid gap-3">
            {cronJobs.map((job) => {
              const isRunning = runningJobId === job.id;
              const isCompleted = job.status === 'Completed';

              return (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 motion-safe:transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-200">{t(job.nameKey)}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                          isCompleted
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                        }`}
                      >
                        {isCompleted ? 'Active & Ready' : t(job.statusKey)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRunCron(job.id, t(job.nameKey))}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold motion-safe:transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                    >
                      <Play size={10} className={isRunning ? 'motion-safe:animate-spin' : ''} />
                      <span>{isRunning ? 'Running...' : t("COPY.RUN_NOW")}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} aria-hidden="true" />
                      <span>{t(job.scheduleKey)}</span>
                    </span>
                    <span>
                      {t("COPY.LAST_RUN")}{' '}
                      <strong className="text-slate-200">
                        {job.lastRun === 'Just now' ? 'Just now' : t(job.lastRunKey)}
                      </strong>
                    </span>
                    <span>
                      {t("COPY.TOOK")}{' '}
                      <strong className="text-emerald-400 font-mono">{job.duration}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Worker Concurrency: <strong className="text-amber-300">BullMQ (4 threads)</strong></span>
          <span className="text-emerald-400">0 stalled jobs</span>
        </div>
      </div>
    </section>
  );
}
