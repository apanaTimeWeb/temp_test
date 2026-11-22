'use client';
/** Responsibility: Superadmin Dashboard Action Items Panel; renders prioritized pending platform actions with rich colors, icons, and action triggers. */
import Link from 'next/link';
import { AlertTriangle, ChevronRight, Lightbulb, ExternalLink, AlertCircle, CircleHelp, CreditCard, Headphones, CloudUpload } from 'lucide-react';
import type { SuperadminDashboardActionItemsPanelProps, SuperadminDashboardActionItem } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config";
import { useTranslations } from 'next-intl';

const ACTION_ITEM_ICONS: Record<string, typeof AlertTriangle> = {
  warning: AlertTriangle,
  credit_card_off: CreditCard,
  support_agent: Headphones,
  cloud_upload: CloudUpload,
  '⚠️': AlertTriangle,
  '🔴': AlertCircle,
  '🔵': CircleHelp,
};

function getItemStyle(type: SuperadminDashboardActionItem['type']) {
  switch (type) {
    case 'error':
      return {
        cardBorderBg: 'border-rose-500/25 bg-rose-500/5 hover:bg-rose-500/10',
        iconBox: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/35',
        titleColor: 'text-rose-100',
        descColor: 'text-rose-200/70',
      };
    case 'warning':
      return {
        cardBorderBg: 'border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10',
        iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/35',
        titleColor: 'text-amber-100',
        descColor: 'text-amber-200/70',
      };
    case 'info':
    default:
      return {
        cardBorderBg: 'border-sky-500/25 bg-sky-500/5 hover:bg-sky-500/10',
        iconBox: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
        badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/35',
        titleColor: 'text-sky-100',
        descColor: 'text-sky-200/70',
      };
  }
}

/**
 * Performs the superadmin dashboard overview action items panel operation within dashboard overview.
 */
export default function SuperadminDashboardOverviewActionItemsPanel({ data }: SuperadminDashboardActionItemsPanelProps) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');

  return (
    <div className="col-span-12 lg:col-span-5 rounded-2xl border border-amber-500/25 bg-[#0c0f28]/95 shadow-md flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-border/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
            <AlertTriangle size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">{t("COPY.ACTION_ITEMS")}</h2>
            <p className="text-xs text-slate-400">Items requiring super admin intervention</p>
          </div>
        </div>

        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          {data.length} Pending
        </span>
      </div>

      {/* Action rows */}
      <div className="p-5 sm:p-6 space-y-3 flex-1">
        {data.map((item) => {
          const Icon = ACTION_ITEM_ICONS[item.icon] ?? AlertTriangle;
          const styles = getItemStyle(item.type);
          const title = item.titleKey ? t(item.titleKey) : item.title;
          const label = item.actionLabelKey ? t(item.actionLabelKey) : item.actionLabel;

          if (!item.actionUrl) {
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${styles.cardBorderBg}`}
                aria-disabled="true"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg border shrink-0 ${styles.iconBox}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${styles.titleColor}`}>{title}</p>
                    <p className={`text-xs truncate ${styles.descColor}`}>{item.description}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{t("COPY.DESTINATION_UNAVAILABLE")}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.actionUrl}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 hover:scale-[1.01] ${styles.cardBorderBg}`}
              data-testid="superadmin-dashboard-dashboard_overview-link-1"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-lg border shrink-0 ${styles.iconBox}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs sm:text-sm font-semibold truncate ${styles.titleColor}`}>{title}</p>
                  <p className={`text-xs truncate ${styles.descColor}`}>{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${styles.badge}`}>
                  {label}
                </span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer Insight Box & View All Link */}
      <div className="p-5 sm:p-6 border-t border-border/80 bg-[#0a0d22]/50">
        <div className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 mb-4">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Lightbulb size={15} />
          </div>
          <p className="text-xs text-amber-100/90 leading-relaxed">
            {t("COPY.5_NEWLY_REGISTERED_LIBRARIES_ARE_YET_TO_COMPLETE_THEIR_INITIAL_SETUP_WIZARD")}
          </p>
        </div>

        <div className="flex justify-end">
          <Link
            href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.LIBRARIES}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 transition-all shadow-sm active:scale-95 cursor-pointer"
            data-testid="superadmin-dashboard-dashboard_overview-link-2"
          >
            <ExternalLink size={13} className="text-indigo-400" />
            <span>{t("COPY.VIEW_ALL_ACTIVITIES")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
