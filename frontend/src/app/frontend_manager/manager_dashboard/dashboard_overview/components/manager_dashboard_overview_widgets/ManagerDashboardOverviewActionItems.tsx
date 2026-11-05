import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Zap, CreditCard, RefreshCw, PhoneCall, ChevronRight } from 'lucide-react';
import { ManagerDashboardOverviewEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/ManagerDashboardOverviewEmptyState';
import type { ManagerDashboardOverviewActionItemsProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
export type { ManagerDashboardOverviewActionItemsProps };

export function ManagerDashboardOverviewActionItems({ items }: ManagerDashboardOverviewActionItemsProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');

  const localizeKnownTitle = (title: string) => {
    switch (title) {
      case 'Fees due today':
        return tManagerUi('dashboard_action_fees_due_today');
      case 'Renewals due':
        return tManagerUi('dashboard_action_renewals_due');
      case 'New enquiries':
        return tManagerUi('dashboard_action_new_enquiries');
      default:
        return title;
    }
  };

  const getItemMetadata = (title: string) => {
    switch (title) {
      case 'Fees due today':
        return {
          icon: CreditCard,
          theme: 'bg-red-500/10 text-red-500 border-red-500/20',
          badgeTheme: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
          desc: 'Outstanding membership fees',
          priority: 'Urgent',
        };
      case 'Renewals due':
        return {
          icon: RefreshCw,
          theme: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          badgeTheme: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          desc: 'Plans ending in 48 hours',
          priority: 'Expiring',
        };
      case 'New enquiries':
        return {
          icon: PhoneCall,
          theme: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          badgeTheme: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          desc: 'Walk-ins & online leads',
          priority: 'Follow Up',
        };
      default:
        return {
          icon: Zap,
          theme: 'bg-primary/10 text-primary border-primary/20',
          badgeTheme: 'bg-primary/10 text-primary border-primary/20',
          desc: 'Manager daily task',
          priority: 'Pending',
        };
    }
  };

  return (
    <section
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all flex flex-col justify-between h-full"
      aria-labelledby="manager-dashboard-action-items-heading"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <Zap size={20} />
            </div>
            <div>
              <h2 id="manager-dashboard-action-items-heading" className="text-base sm:text-lg font-bold text-foreground">
                {tManagerUi('my_action_items')}
              </h2>
              <p className="text-xs text-muted-foreground">High-priority operational workflows</p>
            </div>
          </div>
          {items.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {items.length} Pending
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <ManagerDashboardOverviewEmptyState
            className="p-6 text-sm text-secondary text-center"
            testId="manager-dashboard-action-items-empty"
          >
            {tManagerUi('no_action_items_available')}
          </ManagerDashboardOverviewEmptyState>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const meta = getItemMetadata(item.title);
              const ItemIcon = meta.icon;

              return (
                <div
                  key={item.title}
                  className="mgr-action-item p-3.5 rounded-xl border border-border bg-surface-highlight/30 hover:border-primary/40 hover:bg-surface-highlight/50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${meta.theme}`}>
                      <ItemIcon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="mgr-action-label text-sm font-semibold text-foreground truncate">
                        {localizeKnownTitle(item.title)}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">{meta.desc}</p>
                    </div>
                  </div>

                  <div className="mgr-action-right flex items-center gap-3 shrink-0">
                    <span className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono font-bold text-xs ${meta.badgeTheme}`}>
                      {item.count}
                    </span>

                    <Link
                      href={item.href}
                      className={
                        item.showRenew
                          ? 'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs transition-all'
                          : 'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-card border border-border text-foreground hover:border-primary/50 hover:bg-surface-hover transition-all'
                      }
                    >
                      <span>{item.showRenew ? tManagerUi('renew') : tManagerUi('view')}</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
