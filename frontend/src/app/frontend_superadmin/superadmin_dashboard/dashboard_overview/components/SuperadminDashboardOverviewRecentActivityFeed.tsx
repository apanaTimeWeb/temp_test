'use client';
/** Responsibility: Superadmin Dashboard Recent Activity Feed; displays recent chronological platform events with rich colored dots, timestamps, and links. */
import Link from 'next/link';
import { Clock, ExternalLink } from 'lucide-react';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config";
import type { SuperadminDashboardRecentActivityFeedProps } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { useTranslations } from 'next-intl';

function getDotStyle(cls: string) {
  if (cls.includes('success') || cls.includes('emerald')) {
    return 'bg-emerald-400 shadow-sm shadow-emerald-500/80';
  }
  if (cls.includes('danger') || cls.includes('error') || cls.includes('rose')) {
    return 'bg-rose-400 shadow-sm shadow-rose-500/80';
  }
  if (cls.includes('warning') || cls.includes('amber')) {
    return 'bg-amber-400 shadow-sm shadow-amber-500/80';
  }
  if (cls.includes('info') || cls.includes('sky')) {
    return 'bg-sky-400 shadow-sm shadow-sky-500/80';
  }
  if (cls.includes('purple')) {
    return 'bg-purple-400 shadow-sm shadow-purple-500/80';
  }
  return 'bg-indigo-400 shadow-sm shadow-indigo-500/80';
}

/**
 * Performs the superadmin dashboard overview recent activity feed operation within dashboard overview.
 */
export default function SuperadminDashboardOverviewRecentActivityFeed({ items }: SuperadminDashboardRecentActivityFeedProps) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');

  return (
    <section className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md overflow-hidden mt-6" aria-labelledby="superadmin-recent-activity-title">
      {/* Feed Header */}
      <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30">
            <Clock size={18} className="text-indigo-400" />
          </div>
          <div>
            <h2 id="superadmin-recent-activity-title" className="text-base sm:text-lg font-bold text-white">
              {t("COPY.RECENT_PLATFORM_ACTIVITY")}
            </h2>
            <p className="text-xs text-slate-400">Live system audit events & notifications</p>
          </div>
        </div>

        <Link
          href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.AUDIT_LOGS}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 transition-all shadow-sm active:scale-95 cursor-pointer"
          data-testid="superadmin-dashboard-dashboard_overview-link-1"
        >
          <span>{t("COPY.VIEW_ALL_LOGS")}</span>
          <ExternalLink size={13} className="text-indigo-400" />
        </Link>
      </div>

      {/* Activity List */}
      <div className="p-2 sm:p-3 divide-y divide-border/40">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block p-3.5 sm:p-4 rounded-xl hover:bg-surface-hover/60 transition-all duration-200 group"
            data-testid="superadmin-dashboard-dashboard_overview-link-2"
          >
            <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDotStyle(item.dotCls)}`} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                    {item.titleKey ? t(item.titleKey) : item.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {item.descriptionKey ? t(item.descriptionKey) : item.description}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-medium text-slate-400 bg-surface/80 px-2.5 py-1 rounded-md border border-border/80 shrink-0 self-start sm:self-center">
                {item.timeLabelKey ? t(item.timeLabelKey) : item.timeLabel}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
