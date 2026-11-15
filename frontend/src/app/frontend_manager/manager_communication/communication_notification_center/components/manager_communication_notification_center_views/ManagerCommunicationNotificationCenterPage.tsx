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
    { name: 'My Notifications', labelKey: 'tab_my_notifications', icon: Bell },
    { name: 'Member Notifications', labelKey: 'tab_member_notifications', icon: Send },
    { name: 'Notification History', labelKey: 'tab_notification_history', icon: History },
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            {tManagerUi('notification_center')}
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            {tManagerUi('review_sample_notification_history_and_draft_a_message_p_d184ad')}
          </p>
        </div>
      </div>

      {/* Top Horizontal Segmented Control */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(tab.name)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                isActive
                  ? 'bg-card text-primary border border-border shadow-md ring-1 ring-primary/20'
                  : 'bg-card/60 border border-border text-secondary hover:text-primary hover:bg-card'
              }`}
            >
              <tab.icon
                size={16}
                className={isActive ? 'text-primary' : 'text-secondary/70'}
              />
              <span>{tManagerUi(tab.labelKey)}</span>
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
