'use client';

import { useState } from 'react';
import { Rocket, Sliders } from 'lucide-react';
import { toast } from 'sonner';
import {
  type DeploymentRecord,
  INITIAL_DEPLOYMENTS,
  INITIAL_FLAGS,
  KILLSWITCH_ITEMS,
  type SystemRuntimeControls,
} from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthKillswitchesConfig';
import SuperadminSystemHealthDeploymentsGrid from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthDeploymentsGrid';

export function SuperadminSystemHealthOverviewReleasesControlsCard() {
  const [deployments, setDeployments] = useState<DeploymentRecord[]>(INITIAL_DEPLOYMENTS);
  const [featureFlags, setFeatureFlags] = useState<SystemRuntimeControls>(INITIAL_FLAGS);
  const [rollingBackSha, setRollingBackSha] = useState<string | null>(null);

  const toggleFlag = (key: keyof SystemRuntimeControls, label: string) => {
    const nextState = !featureFlags[key];
    setFeatureFlags((prev) => ({ ...prev, [key]: nextState }));
    if (nextState) {
      toast.success(`${label} is now active (nominal cluster state)`, {
        id: `superadmin:system_health:flag:${String(key)}`,
      });
    } else {
      toast.warning(`${label} killswitch engaged: Subsystem isolated cluster-wide`, {
        id: `superadmin:system_health:flag:${String(key)}`,
      });
    }
  };

  const handleRollback = (record: DeploymentRecord) => {
    setRollingBackSha(record.commitSha);
    toast.info(`Initiating verified blue/green rollback to ${record.version}...`, {
      id: `superadmin:system_health:rollback:${record.commitSha}`,
    });

    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) =>
          d.commitSha === record.commitSha
            ? { ...d, status: 'Live' }
            : { ...d, status: 'Superseded' }
        )
      );
      setRollingBackSha(null);
      toast.success(`Rollback succeeded: Cluster active build switched to ${record.version} (${record.commitSha})`, {
        id: `superadmin:system_health:rollback:${record.commitSha}`,
      });
    }, 1200);
  };

  const activeKillswitchCount = Object.values(featureFlags).filter((v) => v).length;

  return (
    <section
      aria-labelledby="releases-controls-heading"
      className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-[#070b1a] via-[#090e24] to-[#050814] p-6 sm:p-7 shadow-2xl backdrop-blur-xl mb-8 flex flex-col gap-7"
    >
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Hero Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/30 bg-gradient-to-br from-sky-500/20 to-teal-500/10 shadow-inner">
            <Rocket size={22} className="text-sky-300" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 id="releases-controls-heading" className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight">
                Application Version, Deployments & Feature Controls
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-500/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-sky-300 shadow-xs">
                v2.4.1-prod (8f7b32c)
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real-time CI/CD release provenance, verified zero-downtime rollback controls, and autonomous telemetry circuit-breakers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-2 backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-300">Cluster Canary: 100% Traffic Nominal</span>
        </div>
      </div>

      <SuperadminSystemHealthDeploymentsGrid
        deployments={deployments}
        rollingBackSha={rollingBackSha}
        onRollback={handleRollback}
      />

      {/* Feature Release Controls & Emergency Killswitches */}
      <div className="relative z-10 flex flex-col gap-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Sliders size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
                Feature Release Controls & Killswitches
              </h3>
              <p className="text-[11px] text-slate-400">
                Autonomous cluster telemetry circuit-breakers & isolated subsystem cutoffs
              </p>
            </div>
          </div>

          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-semibold text-emerald-300 shadow-xs">
            <span className="text-emerald-400 font-bold">⏻</span>
            Tactical Kill Switch Controls ({activeKillswitchCount}/6 Nominal)
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {KILLSWITCH_ITEMS.map(({ key, label, desc, category, icon: Icon, theme, activeMetric, disabledMetric }) => {
            const isEnabled = featureFlags[key];
            const isEmergencyKey = key === 'maintenanceGate';
            return (
              <div
                key={key}
                className={`group relative overflow-hidden rounded-2xl border ${theme.border} ${theme.bg} ${theme.shadow} p-5 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 flex flex-col justify-between`}
              >
                <div className={`pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full ${theme.glow} blur-2xl motion-safe:transition-all motion-safe:duration-300`} />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${theme.iconBg} shadow-inner transition-transform group-hover:scale-105`}>
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/60">
                          {category}
                        </span>
                        {isEmergencyKey && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/40">
                            High-Impact
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors truncate">
                        {label}
                      </h4>
                      <p className="text-xs text-slate-300/80 leading-relaxed mt-1">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isEnabled}
                      aria-label={`Toggle ${label}`}
                      onClick={() => toggleFlag(key, label)}
                      className={`relative inline-flex h-9 w-[76px] shrink-0 cursor-pointer rounded-full border-2 p-1 transition-colors motion-safe:duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950 shadow-inner ${
                        isEnabled
                          ? isEmergencyKey
                            ? 'border-rose-400 bg-rose-600 shadow-rose-900/50'
                            : 'border-emerald-400 bg-emerald-500 shadow-emerald-900/50'
                          : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition motion-safe:duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-9' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isEnabled
                          ? isEmergencyKey
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {isEnabled ? (isEmergencyKey ? 'ACTIVE (503)' : 'ONLINE') : 'OFFLINE'}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-700/50 text-[11px] font-mono">
                  <span className="text-slate-400">Telemetry Status:</span>
                  <span
                    className={`font-semibold flex items-center gap-1.5 ${
                      isEnabled
                        ? isEmergencyKey
                          ? 'text-rose-300'
                          : 'text-emerald-300'
                        : 'text-amber-400'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isEnabled
                          ? isEmergencyKey
                            ? 'bg-rose-400 animate-ping'
                            : 'bg-emerald-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    {isEnabled ? activeMetric : disabledMetric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
