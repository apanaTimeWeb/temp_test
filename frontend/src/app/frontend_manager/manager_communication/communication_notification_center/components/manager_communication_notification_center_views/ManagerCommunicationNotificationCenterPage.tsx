'use client';
import type { ManagerCommunicationNotificationCenterMainProps } from '@/app/frontend_manager/manager_communication/communication_notification_center/types/ManagerCommunicationNotificationCenterMainTypes';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Bell, Send, History } from 'lucide-react';
import { ManagerCommunicationNotificationCenterNotificationDraftForm } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_forms/ManagerCommunicationNotificationCenterNotificationDraftForm';
import { ManagerCommunicationNotificationCenterNotificationHistorySection } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterNotificationHistorySection';

import { ManagerCommunicationNotificationCenterMyNotificationsSection } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterMyNotificationsSection';


// RESPONSIBILITY: Render the communication_notification_center feature while preserving supported deep-link query state.
// DATA FLOW: Route searchParams -> Main props -> this view's route context.
export default function ManagerCommunicationNotificationCenterPage({ view, id, name, phone, smartId }: ManagerCommunicationNotificationCenterMainProps) {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
  const [activeTab, setActiveTab] = useState('My Notifications');
  
  const TABS = [
    { name: 'My Notifications', labelKey: 'tab_my_notifications', icon: Bell },
    { name: 'Member Notifications', labelKey: 'tab_member_notifications', icon: Send },
    { name: 'Notification History', labelKey: 'tab_notification_history', icon: History },
  ];


  return (
    <div className="mgr-page-animate relative pb-12" data-route-view={view} data-route-id={id}>
      {/* Header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="mgr-breadcrumb">
          <span>{tManagerUi('communication')}</span><span>/</span><span>{tManagerUi('notification_center')}</span>
        </div>
        <h1 className="mgr-page-title flex items-center gap-3 mt-2">
          <Bell className="text-primary" size={28} /> {tManagerUi('notification_center')}
        </h1>
        <p className="text-sm text-secondary">{tManagerUi('review_sample_notification_history_and_draft_a_message_p_d184ad')}</p>
        <p className="mt-2 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" data-testid="manager-communication-send-contract-warning" role="status">{tManagerUi('notification_history_is_sample_data_sending_messages_tri_40ef96')}</p>
      </div>

      {/* Top Horizontal Segmented Control */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(tab.name)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary'
                  : 'bg-card border border-border text-secondary hover:text-primary hover:bg-surface-hover'
              }`}
            >
              <tab.icon size={16} className={isActive ? 'text-primary' : 'opacity-70'} />
              <span>{tManagerUi(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Main Full-Width Card */}
      <div className="mgr-card p-6 min-h-96 w-full shadow-card border border-border">
        {activeTab === 'My Notifications' && <ManagerCommunicationNotificationCenterMyNotificationsSection />}

        {activeTab === 'Member Notifications' && <ManagerCommunicationNotificationCenterNotificationDraftForm />}

        {activeTab === 'Notification History' && <ManagerCommunicationNotificationCenterNotificationHistorySection />}
      </div>
    </div>
  );
}
