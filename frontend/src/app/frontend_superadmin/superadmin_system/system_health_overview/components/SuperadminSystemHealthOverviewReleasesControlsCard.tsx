'use client';
/**
 * Responsibility: Render Application Version, Deployment History log, and Feature Release Controls (canary kill-switches).
 * Flow: System Health Dashboard -> SuperadminSystemHealthOverviewReleasesControlsCard -> interactive toggles and rollback actions.
 * Aesthetic: Ultra-premium dark glassmorphism, heavy-duty 160px x 72px tactile switches, telemetry badges, and live controls.
 */
import { useState } from 'react';
import {
  GitBranch,
  Rocket,
  RotateCcw,
  Sliders,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Database,
  Webhook,
  Activity,
  Power,
  Tag,
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
    desc: 'DDoS edge shield & request burst throttling protection',
    category: 'Edge & Network',
    icon: ShieldAlert,
    theme: {
      bg: 'bg-gradient-to-br from-[#061824]/95 via-[#082333]/90 to-[#0b3045]/85',
      border: 'border-cyan-500/35 hover:border-cyan-400/60',
      shadow: 'shadow-xl shadow-cyan-950/40 hover:shadow-cyan-950/60',
      glow: 'bg-cyan-500/15 group-hover:bg-cyan-500/30',
      iconBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    },
    activeMetric: '4.2k req/s nominal',
    disabledMetric: 'Throttling Bypassed',
  },
  {
    key: 'queueWorkers' as const,
    label: 'Worker Queue Auto-Dispatch',
    desc: 'Async BullMQ tasks & multi-worker compute pool',
    category: 'Compute & Queues',
    icon: Cpu,
    theme: {
      bg: 'bg-gradient-to-br from-[#120a26]/95 via-[#190e38]/90 to-[#23144d]/85',
      border: 'border-indigo-500/35 hover:border-indigo-400/60',
      shadow: 'shadow-xl shadow-indigo-950/40 hover:shadow-indigo-950/60',
      glow: 'bg-indigo-500/15 group-hover:bg-indigo-500/30',
      iconBg: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
    },
    activeMetric: '12 worker pods warm',
    disabledMetric: 'Consumers Halted',
  },
  {
    key: 'dbReadReplicaRouter' as const,
    label: 'Database Read-Replica Router',
    desc: 'Dynamic query routing to secondary storage pool',
    category: 'Database & Storage',
    icon: Database,
    theme: {
      bg: 'bg-gradient-to-br from-[#071329]/95 via-[#0a1c3b]/90 to-[#0e2752]/85',
      border: 'border-blue-500/35 hover:border-blue-400/60',
      shadow: 'shadow-xl shadow-blue-950/40 hover:shadow-blue-950/60',
      glow: 'bg-blue-500/15 group-hover:bg-blue-500/30',
      iconBg: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
    },
    activeMetric: 'Replica lag < 1.2ms',
    disabledMetric: 'Primary-Only Routing',
  },
  {
    key: 'webhookEgress' as const,
    label: 'Outgoing Webhooks Dispatcher',
    desc: 'Event delivery & exponential retry queues',
    category: 'Integrations & Events',
    icon: Webhook,
    theme: {
      bg: 'bg-gradient-to-br from-[#1c1206]/95 via-[#271908]/90 to-[#38240c]/85',
      border: 'border-amber-500/35 hover:border-amber-400/60',
      shadow: 'shadow-xl shadow-amber-950/40 hover:shadow-amber-950/60',
      glow: 'bg-amber-500/15 group-hover:bg-amber-500/30',
      iconBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    },
    activeMetric: '0 dropped webhooks',
    disabledMetric: 'Outbox Buffering',
  },
  {
    key: 'apmDistributedTracing' as const,
    label: 'Distributed Tracing & APM',
    desc: 'OpenTelemetry spans & query latency profiling',
    category: 'Observability',
    icon: Activity,
    theme: {
      bg: 'bg-gradient-to-br from-[#051c12]/95 via-[#072719]/90 to-[#0a3824]/85',
      border: 'border-emerald-500/35 hover:border-emerald-400/60',
      shadow: 'shadow-xl shadow-emerald-950/40 hover:shadow-emerald-950/60',
      glow: 'bg-emerald-500/15 group-hover:bg-emerald-500/30',
      iconBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    },
    activeMetric: '100% traces sampled',
    disabledMetric: 'Telemetry Paused',
  },
  {
    key: 'maintenanceGate' as const,
    label: 'Emergency Maintenance Gate',
    desc: 'Bypass non-admin traffic with HTTP 503 lockout',
    category: 'System Reliability',
    icon: Power,
    theme: {
      bg: 'bg-gradient-to-br from-[#200812]/95 via-[#2c0b19]/90 to-[#3e0f23]/85',
      border: 'border-rose-500/40 hover:border-rose-400/70',
      shadow: 'shadow-xl shadow-rose-950/40 hover:shadow-rose-950/60',
      glow: 'bg-rose-500/25 group-hover:bg-rose-500/40',
      iconBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
    },
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

      {/* Deployments Section: Clean 3-Card Grid */}
      <div className="relative z-10 flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <GitBranch size={15} className="text-sky-400" />
            <span>Recent Production Deployments</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
            Auto-rollback on 5xx spike
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {deployments.map((dep) => {
            const isLive = dep.status === 'Live';
            const isRolling = rollingBackSha === dep.commitSha;
            return (
              <div
                key={dep.commitSha}
                className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between ${
                  isLive
                    ? 'border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900/80 to-[#080d1e] shadow-lg shadow-emerald-500/5'
                    : 'border border-slate-800/80 bg-slate-900/50 hover:border-slate-700/80 hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={13} className={isLive ? 'text-emerald-400' : 'text-slate-500'} />
                    <span className="font-mono text-xs font-bold text-slate-100">{dep.version}</span>
                    <span className="rounded-md border border-slate-700/60 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                      {dep.commitSha}
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                      isLive
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-xs'
                        : 'border-slate-700 bg-slate-800/70 text-slate-400'
                    }`}
                  >
                    {dep.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">{dep.notes}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2.5 border-t border-slate-800/60">
                  <span className="truncate text-[10px]">
                    By <strong className="text-slate-300 font-medium">{dep.author}</strong>
                  </span>

                  {!isLive ? (
                    <button
                      type="button"
                      onClick={() => handleRollback(dep)}
                      disabled={isRolling}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2.5 py-1 text-[11px] font-semibold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
                      title="Rollback cluster to this release"
                    >
                      <RotateCcw size={11} className={isRolling ? 'animate-spin' : ''} />
                      <span>{isRolling ? 'Rolling...' : 'Rollback'}</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={11} /> Active Build
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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

        {/* 6 Rich Colorful Killswitch Cards: 2 Columns with Generous 160px x 72px Switch */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {KILLSWITCH_ITEMS.map(({ key, label, desc, category, icon: Icon, theme, activeMetric, disabledMetric }) => {
            const active = featureFlags[key];
            return (
              <div
                key={key}
                className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between border ${theme.border} ${theme.bg} ${theme.shadow} hover:scale-[1.008]`}
              >
                {/* Ambient Radial Backdrop Glow */}
                <div
                  className={`pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full blur-3xl transition-all duration-500 ${theme.glow}`}
                  aria-hidden="true"
                />

                {/* Main Card Body: Info on Left, 160px Switch on Right */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  {/* Left: Icon & Title info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className={`p-3 rounded-2xl border ${theme.iconBg} shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                        {label}
                      </h4>
                      <p className="text-xs text-slate-300/90 leading-relaxed mt-1 mb-2">
                        {desc}
                      </p>
                      <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Right: Exact 160px x 72px Premium Switch Control */}
                  <div className="switch-area flex flex-col items-center sm:items-end gap-2 shrink-0">
                    {/* Switch Status Pill */}
                    <div
                      className={`switch-status inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border transition-all duration-300 select-none shadow-xs ${
                        active
                          ? 'armed bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                        }`}
                      />
                      <span>{active ? 'SWITCH ARMED' : 'SAFE MODE'}</span>
                    </div>

                    {/* Exact 160px x 72px Oblong Pill Slider Switch with 58px Knob */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={active}
                      aria-label={active ? `Disarm kill switch for ${label}` : `Arm kill switch for ${label}`}
                      aria-pressed={active}
                      onClick={() => toggleFlag(key, label)}
                      className={`premium-switch relative flex items-center w-[160px] h-[72px] p-[7px] rounded-[50px] border-0 cursor-pointer box-border transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                        active
                          ? 'is-armed bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.45),inset_0_2px_4px_rgba(0,0,0,0.25)]'
                          : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-[inset_0_3px_8px_rgba(0,0,0,0.8)] border border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      {/* Recessed internal circuit track glow */}
                      <div
                        className={`pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 h-2 rounded-full transition-all duration-300 ${
                          active
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-300 opacity-60 shadow-[0_0_10px_rgba(16,185,129,0.9)]'
                            : 'bg-slate-950/80 opacity-40'
                        }`}
                      />

                      {/* 58px x 58px Tactile White Chrome Knob with 26px Power Icon ⏻ */}
                      <span
                        aria-hidden="true"
                        className={`switch-knob relative z-10 flex items-center justify-center w-[58px] h-[58px] min-w-[58px] min-h-[58px] rounded-full bg-white transition-transform duration-300 ease-out select-none shadow-[0_4px_14px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.8)_inset] ${
                          active
                            ? 'translate-x-[88px] text-emerald-600'
                            : 'translate-x-0 text-slate-800'
                        }`}
                      >
                        <span className="text-[26px] leading-none select-none font-bold drop-shadow-xs">⏻</span>
                      </span>
                    </button>

                    {/* Switch Hint */}
                    <span className="switch-hint font-mono text-[10px] font-extrabold uppercase tracking-wider text-slate-400 transition-colors select-none">
                      {active ? 'CLICK TO DISARM' : 'CLICK TO ARM'}
                    </span>
                  </div>
                </div>

                {/* Bottom Section: Dynamic Telemetry & State Indicators */}
                <div className="relative z-10 flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                      }`}
                    />
                    <span
                      className={`font-bold tracking-tight text-xs ${
                        active ? 'text-emerald-300' : 'text-rose-400'
                      }`}
                    >
                      {active ? 'Operational (ON)' : 'Killswitch Active (OFF)'}
                    </span>
                  </div>

                  <span className="font-mono text-slate-200 font-bold text-xs bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-lg shrink-0">
                    {active ? activeMetric : disabledMetric}
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
