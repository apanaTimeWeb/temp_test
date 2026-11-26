'use client';
import { useState, useEffect } from 'react';
import { SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/mocks/fixtures/SuperadminSystemHealthOverviewMockFixtures';
import { SUPERADMIN_SYSTEM_HEALTH_NETWORK_ICONS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/constants/SuperadminSystemHealthOverviewConstants';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, Zap } from 'lucide-react';

interface NetworkMetricsProps {
  refreshTrigger?: number;
}

interface KpiCardTheme {
  border: string;
  bg: string;
  shadow: string;
  glow: string;
  iconBox: string;
  valueColor: string;
  unitColor: string;
  badge: string;
  pulseDot: string;
  sparkline: string;
  sparklineHover: string;
  progressBar: string;
}

const KPI_THEMES: Record<string, KpiCardTheme> = {
  requests: {
    border: 'border-emerald-500/25 hover:border-emerald-500/45',
    bg: 'bg-gradient-to-br from-[#061e14]/95 via-[#08281a]/90 to-[#0c3624]/80',
    shadow: 'shadow-lg shadow-emerald-950/30 hover:shadow-xl hover:shadow-emerald-950/45',
    glow: 'bg-emerald-500/10 group-hover:bg-emerald-500/25',
    iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    valueColor: 'text-emerald-400',
    unitColor: 'text-emerald-300/80',
    badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
    pulseDot: 'bg-emerald-400',
    sparkline: 'from-emerald-500/40 to-emerald-400',
    sparklineHover: 'group-hover:from-emerald-500/70 group-hover:to-teal-300',
    progressBar: 'from-emerald-500 via-teal-400 to-emerald-300',
  },
  latency: {
    border: 'border-amber-500/25 hover:border-amber-500/45',
    bg: 'bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80',
    shadow: 'shadow-lg shadow-amber-950/30 hover:shadow-xl hover:shadow-amber-950/45',
    glow: 'bg-amber-500/10 group-hover:bg-amber-500/25',
    iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    valueColor: 'text-amber-400',
    unitColor: 'text-amber-300/80',
    badge: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
    pulseDot: 'bg-amber-400',
    sparkline: 'from-amber-500/40 to-amber-400',
    sparklineHover: 'group-hover:from-amber-500/70 group-hover:to-yellow-300',
    progressBar: 'from-amber-500 via-orange-400 to-amber-300',
  },
  errors: {
    border: 'border-rose-500/25 hover:border-rose-500/45',
    bg: 'bg-gradient-to-br from-[#1c0810]/95 via-[#1c0810]/90 to-[#2c0c1a]/80',
    shadow: 'shadow-lg shadow-rose-950/30 hover:shadow-xl hover:shadow-rose-950/45',
    glow: 'bg-rose-500/10 group-hover:bg-rose-500/25',
    iconBox: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
    valueColor: 'text-rose-400',
    unitColor: 'text-rose-300/80',
    badge: 'text-rose-300 bg-rose-500/10 border-rose-500/25',
    pulseDot: 'bg-rose-400',
    sparkline: 'from-rose-500/40 to-rose-400',
    sparklineHover: 'group-hover:from-rose-500/70 group-hover:to-rose-300',
    progressBar: 'from-rose-500 via-red-400 to-rose-300',
  },
  websockets: {
    border: 'border-cyan-500/25 hover:border-cyan-500/45',
    bg: 'bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80',
    shadow: 'shadow-lg shadow-cyan-950/30 hover:shadow-xl hover:shadow-cyan-950/45',
    glow: 'bg-cyan-500/10 group-hover:bg-cyan-500/25',
    iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
    valueColor: 'text-cyan-400',
    unitColor: 'text-cyan-300/80',
    badge: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25',
    pulseDot: 'bg-cyan-400',
    sparkline: 'from-cyan-500/40 to-cyan-400',
    sparklineHover: 'group-hover:from-cyan-500/70 group-hover:to-sky-300',
    progressBar: 'from-cyan-500 via-sky-400 to-cyan-300',
  },
};

export default function SuperadminSystemHealthOverviewNetworkMetrics({ refreshTrigger = 0 }: NetworkMetricsProps) {
  const t = useTranslations('SUPERADMIN_SYSTEM_HEALTH');
  const [jitter, setJitter] = useState(0);

  useEffect(() => {
    // Subtle realistic telemetry fluctuation
    const newJitter = Math.floor(Math.random() * 20) - 10;
    setJitter(newJitter);
  }, [refreshTrigger]);

  const getMetricValue = (id: string, baseValue: string) => {
    if (id === 'requests') {
      const num = 1240 + jitter * 2;
      return num.toLocaleString();
    }
    if (id === 'latency') {
      const num = Math.max(28, 38 + Math.floor(jitter * 0.4));
      return String(num);
    }
    if (id === 'errors') {
      const num = Math.max(0.005, 0.012 + jitter * 0.0005).toFixed(3);
      return String(num);
    }
    if (id === 'websockets') {
      const num = 8432 + jitter * 3;
      return num.toLocaleString();
    }
    return baseValue;
  };

  const getSparklineData = (id: string) => {
    if (id === 'requests') return [35, 45, 60, 52, 70, 65, 80, 75, 90, 85];
    if (id === 'latency') return [40, 38, 42, 36, 39, 37, 35, 38, 36, 38];
    if (id === 'errors') return [5, 2, 8, 4, 1, 3, 2, 1, 2, 1];
    return [60, 65, 70, 72, 75, 78, 80, 82, 84, 85];
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" aria-label={t('COPY.SAMPLE_NETWORK_METRICS')}>
      {SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS.map((kpi) => {
        const MetricIcon = SUPERADMIN_SYSTEM_HEALTH_NETWORK_ICONS[kpi.id];
        const theme = KPI_THEMES[kpi.id] || KPI_THEMES.requests;
        const currentValue = getMetricValue(kpi.id, kpi.value);
        const sparkline = getSparklineData(kpi.id);

        return (
          <div
            key={kpi.id}
            className={`group relative overflow-hidden rounded-2xl border ${theme.border} ${theme.bg} p-5 ${theme.shadow} motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01]`}
          >
            {/* Ambient Backdrop Radial Glow */}
            <div
              className={`pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full blur-2xl motion-safe:transition-all motion-safe:duration-500 ${theme.glow}`}
              aria-hidden="true"
            />

            {/* Top Row: Icon & Status Badge */}
            <div className="relative flex justify-between items-start mb-3">
              <div
                className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${theme.iconBox}`}
              >
                <MetricIcon size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 font-semibold rounded-full px-2.5 py-0.5 border text-xs ${theme.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.pulseDot} motion-safe:animate-pulse`} />
                  <span>{t(kpi.trendKey)}</span>
                </span>
              </div>
            </div>

            {/* Label */}
            <p className="relative text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              {t(kpi.labelKey)}
            </p>

            {/* Main Value */}
            <div className="relative flex items-baseline gap-1.5">
              <h3 className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${theme.valueColor}`}>
                {currentValue}
              </h3>
              <span className={`text-xs font-normal ${theme.unitColor}`}>{kpi.unit}</span>
            </div>

            {/* Subtitle / Details */}
            <div className="relative flex items-center justify-between text-[11px] mt-2.5 mb-2 font-mono">
              {kpi.id === 'requests' && (
                <>
                  <span className="text-emerald-400 flex items-center font-medium">
                    <ArrowUpRight size={12} className="mr-0.5" /> +4.2% peak
                  </span>
                  <span className="text-emerald-200/70">Max: 2,410</span>
                </>
              )}
              {kpi.id === 'latency' && (
                <>
                  <span className="text-amber-400 font-medium">P50: 16ms</span>
                  <span className="text-amber-200/70">P99: 78ms</span>
                </>
              )}
              {kpi.id === 'errors' && (
                <>
                  <span className="text-rose-400 font-medium">0 critical</span>
                  <span className="text-rose-200/70">99.9% budget</span>
                </>
              )}
              {kpi.id === 'websockets' && (
                <>
                  <span className="text-cyan-400 font-medium flex items-center gap-1">
                    <Zap size={11} /> 14.8 MB/s I/O
                  </span>
                  <span className="text-cyan-200/70">0 drops</span>
                </>
              )}
            </div>

            {/* Mini Sparkline Bar Chart */}
            <div className="relative flex items-end gap-1 h-5 pt-1 w-full opacity-85 group-hover:opacity-100 transition-opacity">
              {sparkline.map((val, idx) => (
                <div
                  key={idx}
                  className={`flex-1 bg-gradient-to-t ${theme.sparkline} ${theme.sparklineHover} rounded-xs motion-safe:transition-all motion-safe:duration-500`}
                  style={{ height: `${Math.max(15, val)}%` }}
                />
              ))}
            </div>

            {/* Progress Accent */}
            <div className="relative mt-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-800/80">
              <div
                className={`h-full bg-gradient-to-r ${theme.progressBar} motion-safe:transition-all motion-safe:duration-500`}
                style={{ width: `${kpi.id === 'errors' ? 98 : 75 + (jitter % 10)}%` }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
