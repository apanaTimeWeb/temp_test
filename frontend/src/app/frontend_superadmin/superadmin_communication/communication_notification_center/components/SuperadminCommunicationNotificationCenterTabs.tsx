'use client';
// RESPONSIBILITY: Secondary navigation tabs for Notification Center with badge indicators.
// FLOW: User tab click -> state/useSuperadminCommunicationNotificationCenterStore -> active view.

import { useEffect } from 'react';
import {
  BellRing,
  FileText,
  History,
  BarChart3,
  Mail,
  MessageSquare,
  CreditCard,
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
    const requestedTab = params.get('tab') as NotificationCenterTab | null;
    const validTabs: NotificationCenterTab[] = [
      'overview',
      'templates',
      'logs',
      'usage',
      'email',
      'sms',
      'payment-reminders',
    ];
    if (requestedTab && validTabs.includes(requestedTab) && requestedTab !== activeTab) {
      setActiveTab(requestedTab);
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
      badgeClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    },
    { id: 'usage', label: 'Usage & Quotas', icon: BarChart3 },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'payment-reminders', label: 'Payment Reminders', icon: CreditCard },
  ];

  return (
    <div className="w-full overflow-x-auto pb-1 border-b border-border/60">
      <nav aria-label="Notification Center Views" className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-card text-foreground border border-border shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent'
              }`}
              data-testid={`notif-tab-${tab.id}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-2xs px-1.5 py-0.5 rounded-full font-bold ${
                    tab.badgeClass ?? 'bg-primary/20 text-primary'
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
