/** Responsibility: Superadmin System Health Header Status; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSystemHealthOverviewHeaderStatus formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { Activity, RefreshCw, ShieldCheck, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Performs the superadmin system health overview header status operation within system health overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminSystemHealthOverviewHeaderStatus() {
  const t = useTranslations('SUPERADMIN_SYSTEM_HEALTH');
  return (
    <>
      <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200" role="status">
        {t("COPY.EVERY_HEALTH_METRIC_ON_THIS_PAGE_IS_SAMPLE_DATA_REFRESH_AND_LIVE_TELEMETRY_CHECKS_ARE_UNAVAILABLE_WITHOUT_THE_HOST_MONITORING_INTEGRATION")}
      </p>

      {/* Hero Header */}
      <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/60 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-lg mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2.5">
              <Activity className="text-emerald-400" size={24} aria-hidden="true" />
              {t("COPY.SYSTEM_HEALTH_TELEMETRY")}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Download size={14} />
              <span>Export Snapshot</span>
            </button>
            <button type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700/60 bg-slate-800/40 text-xs font-semibold text-slate-400 cursor-not-allowed opacity-60"
              disabled title={t("COPY.LIVE_TELEMETRY_INTEGRATION_IS_NOT_INCLUDED_IN_THIS_SOURCE_ARCHIVE")}
              data-testid="superadmin-system-health-system-health-header-status-live-telemetry-integration-is-not-included-in-this-source-archive-1">
              <RefreshCw size={14} aria-hidden="true" /> {t("COPY.LIVE_TELEMETRY_UNAVAILABLE")}
            </button>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/50 via-[#0a0d22] to-[#060810] p-5 sm:p-6 mb-6 flex items-center justify-between relative overflow-hidden" aria-labelledby="superadmin-system-health-status-title">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 shadow-inner">
            <ShieldCheck size={28} className="text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <h2 id="superadmin-system-health-status-title" className="text-lg font-bold text-emerald-300">{t("COPY.SAMPLE_TELEMETRY_NOT_CONNECTED")}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{t("COPY.ILLUSTRATIVE_VALUES_ONLY_NO_LIVE_HEALTH_UPTIME_OR_THIRD_PARTY_API_SOURCE_IS_CONNECTED_IN_THIS_ARCHIVE")}</p>
          </div>
        </div>
        <div className="text-right relative z-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{t("COPY.GLOBAL_UPTIME_30_DAYS")}</p>
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">—</div>
        </div>
      </section>
    </>
  );
}
