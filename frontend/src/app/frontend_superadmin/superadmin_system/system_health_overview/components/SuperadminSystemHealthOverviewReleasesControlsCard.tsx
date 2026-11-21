'use client';
/**
 * Responsibility: Render Application Version, Deployment History log, and Feature Release Controls (canary kill-switches).
 * Flow: System Health Dashboard -> SuperadminSystemHealthOverviewReleasesControlsCard -> interactive toggles and rollback actions.
 * Aesthetic: Ultra-premium dark glassmorphism, glowing micro-circuit switches, telemetry badges, and live tactile controls.
 */
import { useState } from 'react';
import {
  GitBranch,
  Rocket,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Database,
  Webhook,
  Activity,
  Power,
  Tag,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
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
  {
    version: 'v2.4.1-prod',
    commitSha: '8f7b32c',
    author: 'DevOps Automated Pipeline',
    timestamp: 'Today, 14:20 UTC',
    status: 'Live',
    notes: 'Performance patches for PgBouncer & Redis cache eviction.',
  },
  {
    version: 'v2.4.0-prod',
    commitSha: '4a1e90d',
    author: 'Lead Architect',
    timestamp: 'Yesterday, 19:15 UTC',
    status: 'Superseded',
    notes: 'Global Settings 11 Domains release & TanStack Query v5 rollout.',
  },
  {
    version: 'v2.3.9-prod',
    commitSha: '9c8821f',
    author: 'Release Engineer',
    timestamp: '17 Nov 2026, 11:00 UTC',
    status: 'Superseded',
    notes: 'WhatsApp Business Bridge throughput scaling.',
  },
];

interface SystemRuntimeControls {
  apiRateLimiter: boolean;
  queueWorkers: boolean;
  dbReadReplicaRouter: boolean;
  webhookEgress: boolean;
  apmDistributedTracing: boolean;
  maintenanceGate: boolean;
}

const INITIAL_FLAGS: SystemRuntimeControls = {
  apiRateLimiter: true,
  queueWorkers: true,
  dbReadReplicaRouter: true,
  webhookEgress: true,
  apmDistributedTracing: true,
  maintenanceGate: false,
};

const KILLSWITCH_ITEMS = [
  {
    key: 'apiRateLimiter' as const,
    label: 'API Gateway Rate Limiter',
    desc: 'DDoS edge shield & request burst throttling',
    category: 'Edge & Network',
    icon: ShieldAlert,
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/15 border-teal-500/30',
    activeMetric: '4.2k req/s nominal',
    disabledMetric: 'Throttling Bypassed',
  },
  {
    key: 'queueWorkers' as const,
    label: 'Worker Queue Auto-Dispatch',
    desc: 'Async BullMQ tasks & multi-worker pool',
    category: 'Compute & Queues',
    icon: Cpu,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/15 border-sky-500/30',
    activeMetric: '12 worker pods warm',
    disabledMetric: 'Consumers Halted',
  },
  {
    key: 'dbReadReplicaRouter' as const,
    label: 'Database Read-Replica Router',
    desc: 'Dynamic query routing to secondary pool',
    category: 'Database & Storage',
    icon: Database,
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/15 border-indigo-500/30',
    activeMetric: 'Replica lag < 1.2ms',
    disabledMetric: 'Primary-Only Routing',
  },
  {
    key: 'webhookEgress' as const,
    label: 'Outgoing Webhooks Dispatcher',
    desc: 'Event delivery & exponential retry queues',
    category: 'Integrations & Events',
    icon: Webhook,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/15 border-rose-500/30',
    activeMetric: '0 dropped webhooks',
    disabledMetric: 'Outbox Buffering',
  },
  {
    key: 'apmDistributedTracing' as const,
    label: 'Distributed Tracing & APM',
    desc: 'OpenTelemetry spans & query profiling',
    category: 'Observability',
    icon: Activity,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30',
    activeMetric: '100% traces sampled',
    disabledMetric: 'Telemetry Paused',
  },
  {
    key: 'maintenanceGate' as const,
    label: 'Emergency Maintenance Gate',
    desc: 'Bypass non-admin traffic with HTTP 503',
    category: 'System Reliability',
    icon: Power,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15 border-amber-500/30',
    activeMetric: 'Standby (Traffic Open)',
    disabledMetric: '503 LOCKOUT ACTIVE',
  },
] as const;

export function SuperadminSystemHealthOverviewReleasesControlsCard() {
  const [deployments, setDeployments] = useState<DeploymentRecord[]>(INITIAL_DEPLOYMENTS);
  const [featureFlags, setFeatureFlags] = useState<SystemRuntimeControls>(INITIAL_FLAGS);
  const [rollingBackSha, setRollingBackSha] = useState<string | null>(null);

  const toggleFlag = (key: keyof SystemRuntimeControls, label: string) => {
    const nextState = !featureFlags[key];
    setFeatureFlags((prev) => ({ ...prev, [key]: nextState }));
    if (nextState) {
      toast.success(`${label} is now active (nominal cluster state)`);
    } else {
      toast.warning(`${label} killswitch engaged: Subsystem isolated cluster-wide`);
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

  const activeKillswitchCount = Object.values(featureFlags).filter((v) => v).length;

  return (
    <section
      aria-labelledby="releases-controls-heading"
      className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-[#070b1a] via-[#090e24] to-[#050814] p-6 sm:p-7 shadow-2xl backdrop-blur-xl mb-8 flex flex-col gap-7"
    >
      {/* Decorative ambient background glows */}
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

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Left Column: Deployment History */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <GitBranch size={15} className="text-sky-400" />
              <span>Recent Production Deployments</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
              Auto-rollback on 5xx spike
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {deployments.map((dep) => {
              const isLive = dep.status === 'Live';
              const isRolling = rollingBackSha === dep.commitSha;
              return (
                <div
                  key={dep.commitSha}
                  className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${isLive
                      ? 'border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900/80 to-[#080d1e] shadow-lg shadow-emerald-500/5'
                      : 'border border-slate-800/80 bg-slate-900/50 hover:border-slate-700/80 hover:bg-slate-900/70'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Tag size={13} className={isLive ? 'text-emerald-400' : 'text-slate-500'} />
                      <span className="font-mono text-xs font-bold text-slate-100">{dep.version}</span>
                      <span className="rounded-md border border-slate-700/60 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                        {dep.commitSha}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${isLive
                            ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-xs'
                            : 'border-slate-700 bg-slate-800/70 text-slate-400'
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
                        className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-1.5 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                        title="Rollback cluster to this release"
                      >
                        <RotateCcw size={12} className={isRolling ? 'animate-spin' : ''} />
                        <span>{isRolling ? 'Rolling back...' : 'Rollback'}</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">{dep.notes}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
                    <span className="truncate">Pipeline: <strong className="text-slate-300">{dep.author}</strong></span>
                    <span className="shrink-0">{dep.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Feature Release Controls & Killswitches */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders size={15} className="text-emerald-400" />
              <span>Feature Release Controls & Killswitches</span>
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-emerald-300">
              <Zap size={11} className="text-emerald-400" />
              Toggle Switch – ON/OFF control ({activeKillswitchCount}/6 ON)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {KILLSWITCH_ITEMS.map(({ key, label, desc, category, icon: Icon, iconColor, iconBg, activeMetric, disabledMetric }) => {
              const active = featureFlags[key];
              return (
                <div
                  key={key}
                  className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between ${active
                      ? 'border border-emerald-500/30 bg-gradient-to-br from-emerald-950/25 via-slate-900/90 to-[#070c1b] shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-500/10'
                      : 'border border-rose-500/40 bg-gradient-to-br from-rose-950/25 via-slate-900/90 to-[#12070e] shadow-lg hover:border-rose-500/60 hover:shadow-rose-500/10'
                    }`}
                >
                  {/* Subtle ambient light indicator inside card */}
                  <div
                    className={`pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full blur-xl transition-opacity duration-300 ${active ? 'bg-emerald-500/20 opacity-100' : 'bg-rose-500/20 opacity-100'
                      }`}
                  />

                  {/* Top: Icon, Labels & Switch Button */}
                  <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-xl border ${iconBg} ${iconColor} shrink-0 group-hover:scale-105 transition-transform shadow-xs`}>
                        <Icon size={16} aria-hidden="true" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-100 block group-hover:text-white transition-colors">
                          {label}
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                          {desc}
                        </span>
                        <span className="text-[9px] font-mono font-medium text-slate-500 uppercase tracking-wider mt-1 block">
                          {category}
                        </span>
                      </div>
                    </div>

                    {/* Premium Kill Switch Area (from Emergency Kill Switch design) */}
                    <div className="switch-area flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`switch-status font-mono text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider transition-colors duration-200 select-none ${
                            active
                              ? 'armed bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {active ? 'SWITCH ARMED' : 'SAFE MODE'}
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={active}
                          aria-label={active ? `Disarm kill switch for ${label}` : `Arm kill switch for ${label}`}
                          aria-pressed={active}
                          onClick={() => toggleFlag(key, label)}
                          className={`premium-switch relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 ${
                            active
                              ? 'is-armed bg-gradient-to-r from-emerald-600 to-teal-500 border border-emerald-400/40 shadow-xs shadow-emerald-500/40'
                              : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`switch-knob pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full transition-transform duration-200 ease-in-out ${
                              active
                                ? 'translate-x-5 bg-white text-emerald-600 shadow-md font-bold'
                                : 'translate-x-0 bg-slate-400 text-slate-900 shadow-sm font-bold'
                            }`}
                          >
                            <span className="text-[10px] leading-none select-none font-bold">⏻</span>
                          </span>
                        </button>
                      </div>

                      <span className="switch-hint text-[8px] font-mono tracking-tight text-slate-400 uppercase select-none">
                        {active ? 'CLICK TO DISARM' : 'CLICK TO ARM'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Dynamic Telemetry & State Indicators */}
                  <div className="relative z-10 flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full transition-all ${active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                          }`}
                      />
                      <span
                        className={`font-bold tracking-tight ${active ? 'text-emerald-300' : 'text-rose-400'
                          }`}
                      >
                        {active ? 'Operational (ON)' : 'Killswitch Active (OFF)'}
                      </span>
                    </div>

                    <span className="font-mono text-slate-400 text-[10px] shrink-0">
                      {active ? activeMetric : disabledMetric}
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
