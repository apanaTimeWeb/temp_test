'use client';
// RESPONSIBILITY: Primary client orchestrator for Superadmin Notification & Communication Center.
// FLOW: Route page.tsx -> SuperadminCommunicationNotificationCenterMain -> views, tabs & modals.

import { SuperadminCommunicationNotificationCenterHeader } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterHeader';
import { SuperadminCommunicationNotificationCenterTabs } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterTabs';
import { SuperadminCommunicationNotificationCenterOverview } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterOverview';
import { SuperadminCommunicationNotificationCenterTemplatesView } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterTemplatesView';
import { SuperadminCommunicationNotificationCenterLogsTable } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterLogsTable';
import { SuperadminCommunicationNotificationCenterUsageView } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterUsageView';
import { SuperadminCommunicationNotificationCenterComposeModal } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterComposeModal';
import { SuperadminCommunicationNotificationCenterDetailModal } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterDetailModal';
import { SuperadminCommunicationNotificationCenterTemplateModal } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterTemplateModal';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';

export default function SuperadminCommunicationNotificationCenterMain() {
  const { activeTab } = useSuperadminCommunicationNotificationCenterStore();

  return (
    <div
      className="w-full space-y-6"
      data-testid="superadmin-communication-notification-center-main"
    >
      {/* Header */}
      <SuperadminCommunicationNotificationCenterHeader />

      {/* Tabs */}
      <SuperadminCommunicationNotificationCenterTabs />

      {/* Dynamic Tab View */}
      {activeTab === 'overview' && <SuperadminCommunicationNotificationCenterOverview />}
      {activeTab === 'templates' && <SuperadminCommunicationNotificationCenterTemplatesView />}
      {activeTab === 'logs' && <SuperadminCommunicationNotificationCenterLogsTable />}
      {activeTab === 'usage' && <SuperadminCommunicationNotificationCenterUsageView />}
      {activeTab === 'email' && <SuperadminCommunicationNotificationCenterTemplatesView />}
      {activeTab === 'sms' && <SuperadminCommunicationNotificationCenterTemplatesView />}
      {activeTab === 'payment-reminders' && <SuperadminCommunicationNotificationCenterOverview />}

      {/* Interactive Modals */}
      <SuperadminCommunicationNotificationCenterComposeModal />
      <SuperadminCommunicationNotificationCenterDetailModal />
      <SuperadminCommunicationNotificationCenterTemplateModal />
    </div>
  );
}
