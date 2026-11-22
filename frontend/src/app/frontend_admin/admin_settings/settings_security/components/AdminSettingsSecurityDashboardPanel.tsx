'use client';
// RESPONSIBILITY: AdminSecurityDashboardPanel component owned by admin_security; responsibility folder: admin_security_dashboard_panel.

import { ADMIN_SECURITY_DASHBOARD_METRICS } from '@/app/frontend_admin/admin_settings/settings_security/mocks/scenarios/admin_settings_security.scenarios';
import { KeyRound,Shield,ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

const generateSparkline = (title: string) => {
  return `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;
};

const getThemeForTone = (tone: string) => {
  if (tone === 'danger') {
    return {
      cardBorderBg: 'border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30',
      iconBox: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      strokeColor: '#f87171',
      icon: ShieldAlert,
    };
  }
  if (tone === 'success') {
    return {
      cardBorderBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30',
      iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      strokeColor: '#34d399',
      icon: Shield,
    };
  }
  return {
    cardBorderBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30',
    iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    strokeColor: '#fbbf24',
    icon: KeyRound,
  };
};

/** Shows clearly synthetic dashboard metrics; values are not live security telemetry. */
export default function AdminSecurityDashboardPanel() {
  const t = useTranslations('ADMIN_SECURITY');
  return (
    <section className="rounded-2xl border border-indigo-500/20 bg-card p-6 shadow-card" aria-labelledby="admin-security-dashboard-title">
      <h2 id="admin-security-dashboard-title" className="mb-5 text-xl font-bold text-white">{t('DASHBOARD_TITLE')}</h2>
      <p className="sr-only">{t('DEMO_DATA_NOTICE')}</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ADMIN_SECURITY_DASHBOARD_METRICS.map((metric) => {
          const theme = getThemeForTone(metric.tone);
          const Icon = theme.icon;
          return (
            <article
              key={metric.id}
              className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${theme.cardBorderBg}`}
            >
              <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
                <path d={generateSparkline(metric.id)} fill="none" stroke={theme.strokeColor} strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="relative z-10 flex items-start justify-between gap-2">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{t(metric.labelKey)}</span>
                <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${theme.iconBox}`}>
                  <Icon size={18} strokeWidth={2.2} />
                </div>
              </div>
              <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{metric.value}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
        <Shield size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
        <p className="text-xs sm:text-sm">{t('DASHBOARD_STATUS_SAMPLE')}</p>
      </div>
    </section>
  );
}
