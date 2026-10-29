'use client';
import type { ManagerCommunicationNotificationCenterMainProps } from '@/app/frontend_manager/manager_communication/communication_notification_center/types/ManagerCommunicationNotificationCenterMainTypes';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Bell, Send, Clock, CalendarClock, ShieldAlert, Megaphone, History } from 'lucide-react';
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
    { name: 'Overdue Reminders', labelKey: 'tab_overdue_reminders', icon: Clock },
    { name: 'Reservation Alerts', labelKey: 'tab_reservation_alerts', icon: CalendarClock },
    { name: 'Membership Alerts', labelKey: 'tab_membership_alerts', icon: ShieldAlert },
    { name: 'Announcements', labelKey: 'tab_announcements', icon: Megaphone },
    { name: 'Notification History', labelKey: 'tab_notification_history', icon: History },
  ];


  return (
    <div className="mgr-page-animate relative pb-12" data-route-view={view} data-route-id={id} data-route-name={name} data-route-phone={phone} data-route-smart-id={smartId}>
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Sidebar Tabs */}
        <div className="xl:col-span-3 space-y-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(tab.name)}
                aria-pressed={isActive}
                className={`w-full min-h-11 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold motion-safe:transition-all ${
                  isActive 
                    ? 'bg-primary text-on-primary shadow-lg' 
                    : 'text-secondary hover:bg-card hover:text-primary'
                }`}
              >
                <tab.icon size={18} className={isActive ? 'text-primary' : 'opacity-70'} />
                {tManagerUi(tab.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="xl:col-span-9 mgr-card p-6 min-h-96">
          
          {activeTab === 'My Notifications' && <ManagerCommunicationNotificationCenterMyNotificationsSection />}

          {activeTab === 'Member Notifications' && <ManagerCommunicationNotificationCenterNotificationDraftForm />}

          {/* OVERDUE REMINDERS */}
          {activeTab === 'Overdue Reminders' && (
            <div className="motion-safe:transition-all motion-safe:duration-base">
              <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                <h2 className="text-xl font-bold text-primary">{tManagerUi('overdue_reminders_auto_generated')}</h2>
                <button type="button" disabled title={tManagerUi('sending_unavailable_verified_messaging_integration_contr_57b208')} className="mgr-btn-secondary cursor-not-allowed">{tManagerUi('send_all_pending_unavailable')}</button>
              </div>
              <div className="p-10 text-center border-2 border-dashed border-border rounded-xl" role="status">
                <Clock size={48} className="mx-auto text-secondary opacity-50 mb-4" aria-hidden="true" />
                <h3 className="text-lg font-bold text-primary mb-2">{tManagerUi('overdue_reminder_data_unavailable')}</h3>
                <p className="text-secondary">{tManagerUi('overdue_reminder_feed_required')}</p>
              </div>
            </div>
          )}

          {/* RESERVATION ALERTS */}
          {activeTab === 'Reservation Alerts' && (
            <div className="motion-safe:transition-all motion-safe:duration-base">
              <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                <h2 className="text-xl font-bold text-primary">{tManagerUi('seat_reservation_alerts')}</h2>
              </div>
              <div className="p-10 text-center border-2 border-dashed border-border rounded-xl" role="status">
                <CalendarClock size={40} className="mx-auto text-secondary opacity-50 mb-4" aria-hidden="true" />
                <h3 className="text-lg font-bold text-primary mb-2">{tManagerUi('reservation_alert_data_unavailable')}</h3>
                <p className="text-secondary">{tManagerUi('reservation_alert_feed_required')}</p>
              </div>
            </div>
          )}

          {/* MEMBERSHIP ALERTS */}
          {activeTab === 'Membership Alerts' && (
            <div className="motion-safe:transition-all motion-safe:duration-base">
              <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                <h2 className="text-xl font-bold text-primary">{tManagerUi('expiring_memberships')}</h2>
              </div>
              <div className="p-4 rounded-xl bg-danger-bg border border-danger text-danger flex items-start gap-3">
                <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold mb-1">{tManagerUi('membership_expiry_data_unavailable')}</h4>
                  <p className="text-xs opacity-80 mb-3">{tManagerUi('membership_expiry_schedule_unavailable')}</p>
                </div>
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS */}
          {activeTab === 'Announcements' && (
            <div className="motion-safe:transition-all motion-safe:duration-base">
              <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                <h2 className="text-xl font-bold text-primary">{tManagerUi('global_announcements')}</h2>
                <button type="button" disabled title={tManagerUi('announcement_creation_endpoint_is_outside_the_supplied_f_2f2b46')} className="mgr-btn-primary"><Megaphone size={16} className="mr-2 inline" /> {tManagerUi('new_announcement')}</button>
              </div>
              <div className="p-10 text-center border-2 border-dashed border-border rounded-xl" role="status">
                <Megaphone size={40} className="mx-auto text-secondary opacity-50 mb-4" aria-hidden="true" />
                <h3 className="text-lg font-bold text-primary mb-2">{tManagerUi('announcement_data_unavailable')}</h3>
                <p className="text-secondary">{tManagerUi('announcement_feed_required')}</p>
              </div>
            </div>
          )}

          {activeTab === 'Notification History' && <ManagerCommunicationNotificationCenterNotificationHistorySection />}

        </div>
      </div>
    </div>
  );
}
