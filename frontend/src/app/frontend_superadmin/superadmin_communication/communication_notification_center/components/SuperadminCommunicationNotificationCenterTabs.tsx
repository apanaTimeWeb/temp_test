'use client';
// RESPONSIBILITY: Secondary navigation tabs for Notification Center with Cyber-Luxury styling and badge indicators.
// FLOW: User tab click -> state/useSuperadminCommunicationNotificationCenterStore -> active view.

import { useEffect } from 'react';
import {
  BellRing,
  FileText,
  History,
  BarChart3,
} from 'lucide-react';
import {
  useSuperadminCommunicationNotificationCenterStore,
  type NotificationCenterTab,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import { useSuperadminNotificationsQuery } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';

interface TabItem {
  id: NotificationCenterTab;
  label: string;
  icon: typeof BellRing;
  badge?: string | number;
  badgeClass?: string;
}

export function SuperadminCommunicationNotificationCenterTabs() {
  const { activeTab, setActiveTab } = useSuperadminCommunicationNotificationCenterStore();
  const { data: notifications } = useSuperadminNotificationsQuery();

  // Sync tab with URL search param on mount & change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTab = params.get('tab');
    if (!requestedTab) return;

    if (requestedTab === 'email' || requestedTab === 'sms') {
      if (activeTab !== 'templates') setActiveTab('templates');
    } else if (requestedTab === 'payment-reminders') {
      if (activeTab !== 'overview') setActiveTab('overview');
    } else {
      const validTabs: NotificationCenterTab[] = ['overview', 'templates', 'logs', 'usage'];
      if (validTabs.includes(requestedTab as NotificationCenterTab) && requestedTab !== activeTab) {
        setActiveTab(requestedTab as NotificationCenterTab);
      }
    }
  }, [setActiveTab, activeTab]);

  const handleTabChange = (tab: NotificationCenterTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === 'overview') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', tab);
    }
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const failedCount = notifications?.filter((n) => n.status === 'FAILED' || n.status === 'BOUNCED').length ?? 0;

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: BellRing },
    { id: 'templates', label: 'Templates', icon: FileText, badge: '10' },
    {
      id: 'logs',
      label: 'Delivery Logs',
      icon: History,
      badge: failedCount > 0 ? `${failedCount} Failed` : undefined,
      badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
    },
    { id: 'usage', label: 'Usage & Quotas', icon: BarChart3 },
  ];

  return (
    <div className="w-full overflow-x-auto pb-1">
      <nav
        aria-label="Notification Center Views"
        className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-indigo-500/25 backdrop-blur-md shadow-xl min-w-max"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
              data-testid={`notif-tab-${tab.id}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-2xs px-2 py-0.5 rounded-full font-bold ${
                    tab.badgeClass ?? 'bg-indigo-500/25 text-indigo-200 border border-indigo-500/40'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
