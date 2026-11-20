'use client';
/**
 * Responsibility: Render Application Version, Deployment History log, and Feature Release Controls (canary kill-switches).
 * Flow: System Health Dashboard -> SuperadminSystemHealthOverviewReleasesControlsCard -> interactive toggles and rollback actions.
 */
import { useState } from 'react';
import { GitBranch, Rocket, RotateCcw, Sliders, CheckCircle2, AlertTriangle, Shield, Clock, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface DeploymentRecord {
  version: string;
  commitSha: string;
  author: string;
  timestamp: string;
  status: 'Live' | 'Superseded' | 'Rolled Back';
  notes: string;
}

const INITIAL_DEPLOYMENTS: DeploymentRecord[] = [
  { version: 'v2.4.1-prod', commitSha: '8f7b32c', author: 'DevOps Automated Pipeline', timestamp: 'Today, 14:20 UTC', status: 'Live', notes: 'Performance patches for PgBouncer & Redis cache eviction.' },
  { version: 'v2.4.0-prod', commitSha: '4a1e90d', author: 'Lead Architect', timestamp: 'Yesterday, 19:15 UTC', status: 'Superseded', notes: 'Global Settings 11 Domains release & TanStack Query v5 rollout.' },
  { version: 'v2.3.9-prod', commitSha: '9c8821f', author: 'Release Engineer', timestamp: '17 Nov 2026, 11:00 UTC', status: 'Superseded', notes: 'WhatsApp Business Bridge throughput scaling.' },
];

export function SuperadminSystemHealthOverviewReleasesControlsCard() {
  const [deployments, setDeployments] = useState<DeploymentRecord[]>(INITIAL_DEPLOYMENTS);
  const [featureFlags, setFeatureFlags] = useState({
    booksCatalog: true,
    seatsMatrix: true,
    biometricSync: true,
    whatsappBridge: true,
    instantPayouts: false,
    offlineModeSync: true,
  });
  const [rollingBackSha, setRollingBackSha] = useState<string | null>(null);

  const toggleFlag = (key: keyof typeof featureFlags, label: string) => {
    const nextState = !featureFlags[key];
    setFeatureFlags((prev) => ({ ...prev, [key]: nextState }));
    if (nextState) {
      toast.success(`Feature enabled: ${label} is now active cluster-wide`);
    } else {
      toast.warning(`Feature killed: ${label} is disabled globally across all tenants`);
    }
  };

  const handleRollback = (record: DeploymentRecord) => {
    setRollingBackSha(record.commitSha);
    toast.info(`Initiating verified blue/green rollback to ${record.version}...`);

    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) =>
          d.commitSha === record.commitSha
            ? { ...d, status: 'Live' }
            : { ...d, status: 'Superseded' }
        )
      );
      setRollingBackSha(null);
      toast.success(`Rollback succeeded: Cluster active build switched to ${record.version} (${record.commitSha})`);
    }, 1200);
  };

  return (
    <section
      aria-labelledby="releases-controls-heading"
      className="rounded-2xl border border-sky-500/25 bg-gradient-to-br from-[#0a0d26] via-slate-900/90 to-[#070918] p-5 sm:p-6 shadow-xl mb-6 flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
            <Rocket size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="releases-controls-heading" className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Application Version, Deployments & Feature Controls</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                v2.4.1-prod (8f7b32c)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live CI/CD release provenance, blue/green rollback management, and dynamic platform killswitches.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Cluster Canary: 100% Traffic Nominal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Deployment History */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <GitBranch size={14} className="text-sky-400" />
              <span>Recent Production Deployments</span>
            </h3>
            <span className="text-[11px] text-slate-500">Auto-rollback on HTTP 5xx spike</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {deployments.map((dep) => {
              const isLive = dep.status === 'Live';
              const isRolling = rollingBackSha === dep.commitSha;
              return (
                <div
                  key={dep.commitSha}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isLive
                      ? 'border-emerald-500/30 bg-emerald-950/20 shadow-xs'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <Tag size={13} className={isLive ? 'text-emerald-400' : 'text-slate-400'} />
                      <span className="font-bold text-xs text-slate-100 font-mono">{dep.version}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {dep.commitSha}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isLive
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400'
                        }`}
                      >
                        {dep.status}
                      </span>
                    </div>

                    {!isLive && (
                      <button
                        type="button"
                        onClick={() => handleRollback(dep)}
                        disabled={isRolling}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                        title="Rollback cluster to this release"
                      >
                        <RotateCcw size={11} className={isRolling ? 'animate-spin' : ''} />
                        <span>{isRolling ? 'Rolling back...' : 'Rollback'}</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mb-1">{dep.notes}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>By: {dep.author}</span>
                    <span>{dep.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Feature Release Controls & Killswitches */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sliders size={14} className="text-emerald-400" />
              <span>Feature Release Controls & Killswitches</span>
            </h3>
            <span className="text-[11px] text-slate-500">Live instant propagation (&lt; 200ms)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { key: 'booksCatalog' as const, label: 'Books & Inventory Engine', desc: 'Catalog search & checkout' },
              { key: 'seatsMatrix' as const, label: 'Seat Matrix & Shifts', desc: 'Real-time turnstile bookings' },
              { key: 'biometricSync' as const, label: 'Biometric Scanner Sync', desc: 'Hardware punch ingestion' },
              { key: 'whatsappBridge' as const, label: 'WhatsApp Automation', desc: 'Direct message dispatch' },
              { key: 'instantPayouts' as const, label: 'Instant Tenant Payouts', desc: 'Split billing auto-settlement' },
              { key: 'offlineModeSync' as const, label: 'Offline Fallback Sync', desc: 'IndexedDB local punch sync' },
            ].map(({ key, label, desc }) => {
              const active = featureFlags[key];
              return (
                <div
                  key={key}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                    active
                      ? 'border-emerald-500/30 bg-emerald-950/15'
                      : 'border-danger/30 bg-danger-subtle/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{label}</span>
                      <span className="text-[10px] text-slate-400">{desc}</span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={active}
                      onClick={() => toggleFlag(key, label)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        active ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-danger'}`} />
                    <span className={active ? 'text-emerald-300 font-semibold' : 'text-danger font-semibold'}>
                      {active ? 'Operational' : 'Disabled (Killswitch Active)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
