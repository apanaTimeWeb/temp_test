'use client';

import type { ManagerCommunicationNotificationCenterMainProps } from '@/app/frontend_manager/manager_communication/communication_notification_center/types/ManagerCommunicationNotificationCenterMainTypes';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Bell, Send, History } from 'lucide-react';
import { ManagerCommunicationNotificationCenterNotificationDraftForm } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_forms/ManagerCommunicationNotificationCenterNotificationDraftForm';
import { ManagerCommunicationNotificationCenterNotificationHistorySection } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterNotificationHistorySection';
import { ManagerCommunicationNotificationCenterMyNotificationsSection } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterMyNotificationsSection';

export default function ManagerCommunicationNotificationCenterPage({
  view,
  id,
}: ManagerCommunicationNotificationCenterMainProps) {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
  const [activeTab, setActiveTab] = useState('My Notifications');

  const TABS = [
    {
      name: 'My Notifications',
      labelKey: 'tab_my_notifications',
      icon: Bell,
      badge: '3',
      activeStyles: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/50 ring-1 ring-indigo-500/30 shadow-xs',
      activeIcon: 'text-indigo-400',
      badgeStyles: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      name: 'Member Notifications',
      labelKey: 'tab_member_notifications',
      icon: Send,
      badge: 'Compose',
      activeStyles: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-xs',
      activeIcon: 'text-emerald-400',
      badgeStyles: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      name: 'Notification History',
      labelKey: 'tab_notification_history',
      icon: History,
      badge: 'Logs',
      activeStyles: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/50 ring-1 ring-cyan-500/30 shadow-xs',
      activeIcon: 'text-cyan-400',
      badgeStyles: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
  ];

  return (
    <div
      className="mgr-page-animate relative pb-12 space-y-6 max-w-7xl mx-auto"
      data-route-view={view}
      data-route-id={id}
    >
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <Bell size={20} />
            </span>
            <span>{tManagerUi('notification_center')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            {tManagerUi('review_sample_notification_history_and_draft_a_message_p_d184ad')}
          </p>
        </div>
      </div>

      {/* Top Horizontal Segmented Control with Interactive Colorful Active State */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(tab.name)}
              aria-pressed={isActive}
              className={`group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer border ${
                isActive
                  ? tab.activeStyles
                  : 'bg-card/60 border-border text-secondary hover:text-primary hover:bg-card hover:border-border-focus'
              }`}
            >
              <tab.icon
                size={16}
                className={isActive ? tab.activeIcon : 'text-secondary/70 group-hover:text-primary transition-colors'}
              />
              <span>{tManagerUi(tab.labelKey)}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border transition-colors ${
                    isActive
                      ? tab.badgeStyles
                      : 'bg-surface border-border text-secondary group-hover:text-primary'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Full-Width Card */}
      <div className="mgr-card p-4 sm:p-6 min-h-96 w-full shadow-sm border border-border">
        {activeTab === 'My Notifications' && (
          <ManagerCommunicationNotificationCenterMyNotificationsSection />
        )}

        {activeTab === 'Member Notifications' && (
          <ManagerCommunicationNotificationCenterNotificationDraftForm />
        )}

        {activeTab === 'Notification History' && (
          <ManagerCommunicationNotificationCenterNotificationHistorySection />
        )}
      </div>
    </div>
  );
}
