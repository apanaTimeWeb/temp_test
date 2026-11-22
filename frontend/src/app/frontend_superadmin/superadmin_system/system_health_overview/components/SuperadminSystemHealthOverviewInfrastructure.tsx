'use client';
import { useState } from 'react';
import { Database, Server, Cpu, HardDrive, RefreshCw, Sliders, CheckCircle2 } from 'lucide-react';
import { SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE, SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/mocks/fixtures/SuperadminSystemHealthOverviewMockFixtures';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function SuperadminSystemHealthOverviewInfrastructure() {
  const t = useTranslations('SUPERADMIN_SYSTEM_HEALTH');
  const [infraNodes, setInfraNodes] = useState(SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE);
  const [dbNodes, setDbNodes] = useState(SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE);
  const [optimizingCompute, setOptimizingCompute] = useState(false);
  const [optimizingDb, setOptimizingDb] = useState(false);

  const handleOptimizeCompute = () => {
    setOptimizingCompute(true);
    setTimeout(() => {
      setInfraNodes((prev) =>
        prev.map((n) =>
          n.id === 'background-worker' ? { ...n, usage: 58, ping: '22ms', status: 'Healthy' as const } : n
        )
      );
      setOptimizingCompute(false);
      toast.success('Worker cluster autoscaled: 3 additional pods warm, CPU reduced to 58%');
    }, 600);
  };

  const handleOptimizeDb = () => {
    setOptimizingDb(true);
    setTimeout(() => {
      setDbNodes((prev) =>
        prev.map((n) =>
          n.id === 'postgres-primary' ? { ...n, val: '520 / 1000', pct: 52 } : n
        )
      );
      setOptimizingDb(false);
      toast.success('PgBouncer connection pool purged: 320 idle leases reclaimed');
    }, 600);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" aria-label={t("COPY.SAMPLE_INFRASTRUCTURE_RESOURCES")}>
      {/* Compute Infrastructure */}
      <div className="rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-950/40 via-[#0a0d24] to-[#070914] p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
                <Server size={18} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">{t("COPY.COMPUTE_INFRASTRUCTURE")}</h2>
                <span className="text-[11px] text-slate-400">{t("COPY.SAMPLE_REGION_UNVERIFIED")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOptimizeCompute}
              disabled={optimizingCompute}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            >
              <Sliders size={12} className={optimizingCompute ? 'animate-spin' : ''} />
              <span>{optimizingCompute ? 'Optimizing...' : 'Autoscale Pool'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {infraNodes.map((node) => (
              <div key={node.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-sky-400" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-slate-100">{t(node.nameKey)}</p>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {node.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">{node.ping} {t("COPY.SAMPLE_PING")}</span>
                    <span className={`text-xs font-bold font-mono ${node.usage > 85 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {node.usage}{t("COPY.SAMPLE_CPU")}
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      node.usage > 85
                        ? 'bg-amber-400'
                        : 'bg-gradient-to-r from-sky-500 to-emerald-400'
                    }`}
                    style={{ width: `${node.usage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Cluster Throughput: <strong className="text-sky-300">1.4 GB/s Net I/O</strong></span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={11} />
            Auto-healing enabled
          </span>
        </div>
      </div>

      {/* Database & Storage */}
      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/40 via-[#0a0d24] to-[#070914] p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                <Database size={18} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">{t("COPY.DATABASE_STORAGE")}</h2>
                <span className="text-[11px] text-slate-400">{t("COPY.REPLICATION_STATUS_NOT_CONNECTED")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOptimizeDb}
              disabled={optimizingDb}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={12} className={optimizingDb ? 'animate-spin' : ''} />
              <span>{optimizingDb ? 'Optimizing...' : 'Optimize Pool'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {dbNodes.map((node) => (
              <div key={node.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive size={14} className="text-indigo-400" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-slate-100">{t(node.nameKey)}</p>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {node.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{t(node.metricKey)}:</span>
                    <span className="text-xs font-bold font-mono text-indigo-300">{node.val}</span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-500"
                    style={{ width: `${node.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Replica Lag: <strong className="text-indigo-300">&lt; 1.5ms</strong></span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={11} />
            WAL Streaming Synced
          </span>
        </div>
      </div>
    </section>
  );
}
