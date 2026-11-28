'use client';

import '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_styles/ManagerCommunicationNotificationCenterManager_notification_center.css';
import { ManagerCommunicationNotificationCenterNotificationDraftForm } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_forms/ManagerCommunicationNotificationCenterNotificationDraftForm';
import { ManagerCommunicationNotificationCenterFlyerModal } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_modals/ManagerCommunicationNotificationCenterFlyerModal';
import { ManagerCommunicationNotificationCenterMyNotificationsSection } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterMyNotificationsSection';
import { ManagerCommunicationNotificationCenterNotificationHistorySection } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterNotificationHistorySection';
import type { ManagerCommunicationNotificationCenterMainProps } from '@/app/frontend_manager/manager_communication/communication_notification_center/types/ManagerCommunicationNotificationCenterMainTypes';
import { Bell,History,Printer,Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ManagerCommunicationNotificationCenterPage({
  view,
  id,
}: ManagerCommunicationNotificationCenterMainProps) {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
  const [activeTab, setActiveTab] = useState('My Notifications');
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);

  const TABS = [
    {
      name: 'My Notifications',
      labelKey: 'tab_my_notifications',
      icon: Bell,
      badge: '3',
      activeClass: 'mnc-tab--indigo',
      activeIcon: 'text-indigo-400',
      badgeActiveClass: 'mnc-tab-badge--indigo',
    },
    {
      name: 'Member Notifications',
      labelKey: 'tab_member_notifications',
      icon: Send,
      badge: 'Compose',
      activeClass: 'mnc-tab--emerald',
      activeIcon: 'text-emerald-400',
      badgeActiveClass: 'mnc-tab-badge--emerald',
    },
    {
      name: 'Notification History',
      labelKey: 'tab_notification_history',
      icon: History,
      badge: 'Logs',
      activeClass: 'mnc-tab--cyan',
      activeIcon: 'text-cyan-400',
      badgeActiveClass: 'mnc-tab-badge--cyan',
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
            <span className="w-9 h-9 rounded-xl bg-primary-subtle border border-border text-primary flex items-center justify-center shrink-0">
              <Bell size={20} />
            </span>
            <span>{tManagerUi('notification_center')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            {tManagerUi('review_sample_notification_history_and_draft_a_message_p_d184ad')}
          </p>
        </div>

        {/* Quick A4 Noticeboard Flyer Generator Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsFlyerModalOpen(true)}
            className="mgr-btn-primary inline-flex items-center gap-2 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm cursor-pointer"
            title="Open printable A4 noticeboard flyer generator"
          >
            <Printer size={15} />
            <span>Print Noticeboard Flyer (A4 नोटिस)</span>
          </button>
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
                  ? `${tab.activeClass} font-bold`
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
                      ? tab.badgeActiveClass
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

      {/* Printable A4 Noticeboard Flyer Modal */}
      <ManagerCommunicationNotificationCenterFlyerModal
        isOpen={isFlyerModalOpen}
        onClose={() => setIsFlyerModalOpen(false)}
      />
    </div>
  );
}
