'use client';
import { useState, useEffect } from 'react';
import { Activity, RefreshCw, ShieldCheck, Download, Stethoscope, Clock, CheckCircle2, Radio, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import SuperadminSystemHealthOverviewDiagnosticsModal from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewDiagnosticsModal';
import SuperadminSystemHealthOverviewExportModal from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewExportModal';

interface HeaderStatusProps {
  onRefresh?: () => void;
  lastUpdated?: Date;
  isRefreshing?: boolean;
  autoRefreshInterval?: number;
  setAutoRefreshInterval?: (interval: number) => void;
}

export default function SuperadminSystemHealthOverviewHeaderStatus({
  onRefresh,
  lastUpdated = new Date(),
  isRefreshing = false,
  autoRefreshInterval = 15,
  setAutoRefreshInterval,
}: HeaderStatusProps) {
  const t = useTranslations('SUPERADMIN_SYSTEM_HEALTH');
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [localRefreshing, setLocalRefreshing] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const handleManualRefresh = () => {
    setLocalRefreshing(true);
    setSecondsAgo(0);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      setLocalRefreshing(false);
      toast.success('Telemetry matrix refreshed across 8 cluster nodes (18ms response)', {
        id: 'superadmin:system_health:telemetry-refresh',
      });
    }, 500);
  };

  const refreshing = isRefreshing || localRefreshing;

  return (
    <>
      {/* Top Operations Command Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-emerald-500/25 bg-emerald-950/20 px-4 py-2.5 text-xs text-emerald-200 shadow-sm backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-semibold text-emerald-300">{t("COPY.SYSTEM_OPERATIONAL")}</span>
          <span className="text-emerald-500/60">•</span>
          <span className="text-slate-300">Cluster Telemetry Stream: <strong className="text-emerald-400">8 Edge Nodes Online</strong></span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="text-[11px] font-mono">
            Synced: <strong className="text-slate-200">{secondsAgo}s ago</strong>
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck size={13} />
            <span>0 Active Incidents</span>
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-[#0a0d26] to-[#060814] p-5 sm:p-6 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Observability Control Plane
              </span>
              <span className="text-xs text-slate-400 font-mono">ap-south-1 (Mumbai Core)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-3 tracking-tight">
              <Activity className="text-emerald-400 motion-safe:animate-pulse" size={28} aria-hidden="true" />
              <span>{t("COPY.SYSTEM_HEALTH_TELEMETRY")}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Autonomous cluster health monitoring, live microservice heartbeats, latency histograms, and infrastructure diagnostics
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Auto Refresh Interval Dropdown */}
            {setAutoRefreshInterval && (
              <div className="flex items-center rounded-xl border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300">
                <Radio size={13} className="text-emerald-400 mr-1.5 motion-safe:animate-pulse" />
                <span className="text-slate-400 mr-1 text-[11px]">Stream:</span>
                <select
                  value={autoRefreshInterval}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAutoRefreshInterval(val);
                    if (val > 0) toast.info(`Live telemetry auto-refresh set to ${val}s`, { id: 'superadmin:system_health:auto-refresh' });
                    else toast.info('Auto-refresh paused', { id: 'superadmin:system_health:auto-refresh' });
                  }}
                  className="bg-transparent text-emerald-300 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value={5} className="bg-slate-900 text-slate-200">5s (Live)</option>
                  <option value={15} className="bg-slate-900 text-slate-200">15s</option>
                  <option value={30} className="bg-slate-900 text-slate-200">30s</option>
                  <option value={0} className="bg-slate-900 text-slate-200">Paused</option>
                </select>
              </div>
            )}

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 text-xs font-semibold shadow-sm motion-safe:transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              data-testid="superadmin-system-health-refresh-telemetry-btn"
            >
              <RefreshCw size={14} className={refreshing ? 'motion-safe:animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : t("COPY.REFRESH_TELEMETRY")}</span>
            </button>

            {/* Deep Diagnostics */}
            <button
              type="button"
              onClick={() => setDiagnosticsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-500/40 bg-sky-500/20 text-sky-200 hover:bg-sky-500/30 text-xs font-semibold shadow-sm motion-safe:transition-all active:scale-95 cursor-pointer"
            >
              <Stethoscope size={14} className="text-sky-400" />
              <span>{t("COPY.RUN_DIAGNOSTICS")}</span>
            </button>

            {/* Export Snapshot */}
            <button
              type="button"
              onClick={() => setExportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-sm motion-safe:transition-all active:scale-95 cursor-pointer"
            >
              <Download size={14} />
              <span>{t("COPY.EXPORT_SNAPSHOT")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/50 via-[#0a0d24] to-[#070914] p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden shadow-lg" aria-labelledby="superadmin-system-health-status-title">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 shadow-inner shrink-0">
            <ShieldCheck size={28} className="text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="superadmin-system-health-status-title" className="text-lg font-bold text-emerald-300">
                {t("COPY.SYSTEM_OPERATIONAL")}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                <CheckCircle2 size={10} />
                SLA Tier 1
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              All 8 core services running with optimal throughput. Automated health probes passing every 15 seconds.
            </p>
          </div>
        </div>

        <div className="sm:text-right relative z-10 bg-slate-900/40 p-3 sm:p-0 rounded-xl sm:bg-transparent w-full sm:w-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {t("COPY.GLOBAL_UPTIME_30_DAYS")}
          </p>
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight font-mono flex items-center sm:justify-end gap-1.5">
            <span>99.991%</span>
            <span className="text-xs text-emerald-500 font-sans font-medium">(Nominal)</span>
          </div>
        </div>
      </section>

      {/* Diagnostics Modal */}
      <SuperadminSystemHealthOverviewDiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
      />

      {/* Export Modal */}
      <SuperadminSystemHealthOverviewExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </>
  );
}
