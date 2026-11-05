// RESPONSIBILITY: Render the dashboard overview quick links component within the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the dashboard overview quick links component within the components feature. It does not own backend persistence or cross-feature business logic.
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Compass,
  Users,
  PhoneCall,
  CreditCard,
  AlertCircle,
  CalendarCheck,
  QrCode,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import type {
  ManagerDashboardOverviewQuickLink,
  ManagerDashboardOverviewQuickLinkTitleKey,
  ManagerDashboardOverviewQuickLinksProps,
} from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
export type {
  ManagerDashboardOverviewQuickLinkTitleKey,
  ManagerDashboardOverviewQuickLink,
  ManagerDashboardOverviewQuickLinksProps,
};

const quickLinkIconMap: Record<string, { icon: LucideIcon; theme: string }> = {
  quick_all_students: {
    icon: Users,
    theme: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  quick_enquiries: {
    icon: PhoneCall,
    theme: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  quick_collect_fee: {
    icon: CreditCard,
    theme: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  quick_add_complaint: {
    icon: AlertCircle,
    theme: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
  quick_mark_attendance: {
    icon: CalendarCheck,
    theme: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  quick_qr_scanner: {
    icon: QrCode,
    theme: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  },
};

export function ManagerDashboardOverviewQuickLinks({ links }: ManagerDashboardOverviewQuickLinksProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');

  return (
    <section
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all"
      aria-labelledby="manager-dashboard-quick-links-heading"
    >
      <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
            <Compass size={20} />
          </div>
          <div>
            <h2 id="manager-dashboard-quick-links-heading" className="text-base sm:text-lg font-bold text-foreground">
              {tManagerUi('quick_links')}
            </h2>
            <p className="text-xs text-muted-foreground">Fast-access shortcuts to frequently used workflows</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {links.map((link) => {
          const config = quickLinkIconMap[link.titleKey] || {
            icon: Compass,
            theme: 'bg-primary/10 text-primary border-primary/20',
          };
          const Icon = config.icon;

          return (
            <Link
              key={link.titleKey}
              href={link.href}
              className="p-3.5 rounded-xl border border-border bg-surface-highlight/30 hover:border-primary/50 hover:bg-surface-highlight/60 transition-all duration-200 group flex items-center justify-between gap-2.5 shadow-xs hover:-translate-y-0.5 text-inherit no-underline"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${config.theme}`}>
                  <Icon size={16} />
                </div>
                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {tManagerUi(link.titleKey)}
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
