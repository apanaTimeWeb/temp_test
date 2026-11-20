'use client';
import { useState, useEffect } from 'react';
import { SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/mocks/fixtures/SuperadminSystemHealthOverviewMockFixtures';
import { SUPERADMIN_SYSTEM_HEALTH_NETWORK_COLORS, SUPERADMIN_SYSTEM_HEALTH_NETWORK_ICONS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/constants/SuperadminSystemHealthOverviewConstants';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles } from 'lucide-react';

interface NetworkMetricsProps {
  refreshTrigger?: number;
}

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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" aria-label={t("COPY.SAMPLE_NETWORK_METRICS")}>
      {SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS.map((kpi) => {
        const MetricIcon = SUPERADMIN_SYSTEM_HEALTH_NETWORK_ICONS[kpi.id];
        const metricColor = SUPERADMIN_SYSTEM_HEALTH_NETWORK_COLORS[kpi.id];
        const currentValue = getMetricValue(kpi.id, kpi.value);
        const sparkline = getSparklineData(kpi.id);

        return (
          <div
            key={kpi.id}
            className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0b0e24] via-slate-900/90 to-[#080b1a] p-5 shadow-lg hover:border-emerald-500/40 hover:shadow-emerald-500/5 transition-all duration-300"
          >
            {/* Top Row: Icon & Status Badge */}
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 ${metricColor} group-hover:scale-105 transition-transform`}>
                <MetricIcon size={20} aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t(kpi.trendKey)}</span>
                </span>
              </div>
            </div>

            {/* Label */}
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              {t(kpi.labelKey)}
            </p>

            {/* Main Value */}
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
                {currentValue}
              </h3>
              <span className="text-xs text-slate-400 font-normal">{kpi.unit}</span>
            </div>

            {/* Subtitle / Details */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 mb-2 font-mono">
              {kpi.id === 'requests' && (
                <>
                  <span className="text-emerald-400 flex items-center">
                    <ArrowUpRight size={12} className="mr-0.5" /> +4.2% peak
                  </span>
                  <span>Max: 2,410</span>
                </>
              )}
              {kpi.id === 'latency' && (
                <>
                  <span className="text-emerald-400">P50: 16ms</span>
                  <span className="text-slate-300">P99: 78ms</span>
                </>
              )}
              {kpi.id === 'errors' && (
                <>
                  <span className="text-emerald-400">0 critical</span>
                  <span className="text-slate-300">99.9% budget</span>
                </>
              )}
              {kpi.id === 'websockets' && (
                <>
                  <span className="text-sky-400">14.8 MB/s I/O</span>
                  <span className="text-slate-300">0 drops</span>
                </>
              )}
            </div>

            {/* Mini Sparkline Bar Chart */}
            <div className="flex items-end gap-1 h-5 pt-1 w-full opacity-80 group-hover:opacity-100 transition-opacity">
              {sparkline.map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-emerald-500/40 to-emerald-400 rounded-xs transition-all duration-500 group-hover:from-emerald-500/60 group-hover:to-teal-300"
                  style={{ height: `${Math.max(15, val)}%` }}
                />
              ))}
            </div>

            {/* Progress Accent */}
            <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 transition-all duration-500"
                style={{ width: `${kpi.id === 'errors' ? 98 : 75 + (jitter % 10)}%` }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
