'use client';

import type { LucideIcon } from 'lucide-react';

export interface FinesTabItem {
  id: string;
  labelKey: string;
  icon: LucideIcon;
  count: number | null;
}

interface ManagerFinanceFinesPaymentsTabsBarProps {
  tabs: FinesTabItem[];
  activeTab: string;
  getTabLabel: (labelKey: string) => string;
  onSelectTab: (tabId: string) => void;
}

function getTabStyles(tabId: string, isActive: boolean) {
  switch (tabId) {
    case 'pending':
      return {
        btn: isActive ? 'bg-rose-600 text-white shadow-md ring-1 ring-rose-600' : 'bg-card border border-border text-secondary hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-rose-500/5',
        icon: isActive ? 'text-white' : 'text-rose-500',
        badge: isActive ? 'bg-white text-rose-700 shadow-xs' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
      };
    case 'paid':
      return {
        btn: isActive ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-600' : 'bg-card border border-border text-secondary hover:text-emerald-600 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-500/5',
        icon: isActive ? 'text-white' : 'text-emerald-500',
        badge: isActive ? 'bg-white text-emerald-700 shadow-xs' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      };
    case 'partiallyPaid':
      return {
        btn: isActive ? 'bg-amber-600 text-white shadow-md ring-1 ring-amber-600' : 'bg-card border border-border text-secondary hover:text-amber-600 hover:border-amber-300 dark:hover:border-amber-800 hover:bg-amber-500/5',
        icon: isActive ? 'text-white' : 'text-amber-500',
        badge: isActive ? 'bg-white text-amber-800 shadow-xs' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      };
    case 'receipts':
      return {
        btn: isActive ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-600' : 'bg-card border border-border text-secondary hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-500/5',
        icon: isActive ? 'text-white' : 'text-blue-500',
        badge: isActive ? 'bg-white text-blue-700 shadow-xs' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
      };
    default:
      return {
        btn: isActive ? 'bg-primary text-on-primary shadow-md ring-1 ring-primary' : 'bg-card border border-border text-secondary hover:text-primary hover:bg-surface-hover',
        icon: isActive ? 'text-on-primary' : 'text-secondary',
        badge: isActive ? 'bg-primary-subtle text-primary shadow-xs' : 'bg-muted text-secondary',
      };
  }
}

export default function ManagerFinanceFinesPaymentsTabsBar({
  tabs,
  activeTab,
  getTabLabel,
  onSelectTab,
}: ManagerFinanceFinesPaymentsTabsBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-border">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const tabStyle = getTabStyles(tab.id, isActive);
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${tabStyle.btn}`}
          >
            <tab.icon size={15} className={tabStyle.icon} />
            <span>{getTabLabel(tab.labelKey)}</span>
            {tab.count !== null && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tabStyle.badge}`}>{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
