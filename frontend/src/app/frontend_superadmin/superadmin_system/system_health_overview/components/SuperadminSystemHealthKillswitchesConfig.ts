import { Activity, Cpu, Database, Power, ShieldAlert, Webhook } from 'lucide-react';

export { type DeploymentRecord, INITIAL_DEPLOYMENTS } from './SuperadminSystemHealthDeploymentsConfig';
export { type SystemRuntimeControls, INITIAL_FLAGS } from './SuperadminSystemHealthRuntimeFlagsConfig';

export const KILLSWITCH_ITEMS = [
  {
    key: 'apiRateLimiter' as const,
    label: 'API Gateway Rate Limiter',
    desc: 'DDoS edge shield & request burst throttling protection',
    category: 'Edge & Network',
    icon: ShieldAlert,
    theme: {
      bg: 'bg-gradient-to-br from-[#061824]/95 via-[#082333]/90 to-[#0b3045]/85',
      border: 'border-cyan-500/35 hover:border-cyan-400/60', shadow: 'shadow-xl shadow-cyan-950/40 hover:shadow-cyan-950/60',
      glow: 'bg-cyan-500/15 group-hover:bg-cyan-500/30', iconBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
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
      border: 'border-indigo-500/35 hover:border-indigo-400/60', shadow: 'shadow-xl shadow-indigo-950/40 hover:shadow-indigo-950/60',
      glow: 'bg-indigo-500/15 group-hover:bg-indigo-500/30', iconBg: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
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
      border: 'border-blue-500/35 hover:border-blue-400/60', shadow: 'shadow-xl shadow-blue-950/40 hover:shadow-blue-950/60',
      glow: 'bg-blue-500/15 group-hover:bg-blue-500/30', iconBg: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
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
      border: 'border-amber-500/35 hover:border-amber-400/60', shadow: 'shadow-xl shadow-amber-950/40 hover:shadow-amber-950/60',
      glow: 'bg-amber-500/15 group-hover:bg-amber-500/30', iconBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
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
      border: 'border-emerald-500/35 hover:border-emerald-400/60', shadow: 'shadow-xl shadow-emerald-950/40 hover:shadow-emerald-950/60',
      glow: 'bg-emerald-500/15 group-hover:bg-emerald-500/30', iconBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
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
      border: 'border-rose-500/40 hover:border-rose-400/70', shadow: 'shadow-xl shadow-rose-950/40 hover:shadow-rose-950/60',
      glow: 'bg-rose-500/25 group-hover:bg-rose-500/40', iconBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
    },
    activeMetric: 'Standby (Traffic Open)',
    disabledMetric: '503 LOCKOUT ACTIVE',
  },
] as const;
