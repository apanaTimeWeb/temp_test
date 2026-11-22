'use client';
// RESPONSIBILITY: Primary client orchestrator for Superadmin Notification & Communication Center.
// FLOW: Route page.tsx -> SuperadminCommunicationNotificationCenterMain -> views, tabs & modals.

import { SuperadminCommunicationNotificationCenterHeader } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterHeader';
import { SuperadminCommunicationNotificationCenterTabs } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterTabs';
import { SuperadminCommunicationNotificationCenterOverview } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterOverview';
import { SuperadminCommunicationNotificationCenterTemplatesView } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterTemplatesView';
import { SuperadminCommunicationNotificationCenterLogsTable } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterLogsTable';
import { SuperadminCommunicationNotificationCenterUsageView } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterUsageView';
import { SuperadminCommunicationTenantWalletView } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationTenantWalletView';
import { SuperadminCommunicationNotificationCenterComposeModal } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterComposeModal';
import { SuperadminCommunicationNotificationCenterDetailModal } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterDetailModal';
import { SuperadminCommunicationNotificationCenterTemplateModal } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterTemplateModal';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';

export default function SuperadminCommunicationNotificationCenterMain() {
  const { activeTab } = useSuperadminCommunicationNotificationCenterStore();

  return (
    <div
      className="relative isolate w-full space-y-6"
      data-testid="superadmin-communication-notification-center-main"
    >
      {/* Cyber ambient glow spotlights */}
      <div className="pointer-events-none absolute -top-24 right-10 -z-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-48 -left-12 -z-10 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

      {/* Header */}
      <SuperadminCommunicationNotificationCenterHeader />

      {/* Segmented Floating Tabs */}
      <SuperadminCommunicationNotificationCenterTabs />

      {/* Dynamic Tab Views */}
      {activeTab === 'overview' && <SuperadminCommunicationNotificationCenterOverview />}
      {activeTab === 'templates' && <SuperadminCommunicationNotificationCenterTemplatesView />}
      {activeTab === 'logs' && <SuperadminCommunicationNotificationCenterLogsTable />}
      {activeTab === 'usage' && <SuperadminCommunicationNotificationCenterUsageView />}
      {activeTab === 'wallet' && <SuperadminCommunicationTenantWalletView />}

      {/* Interactive Modals */}
      <SuperadminCommunicationNotificationCenterComposeModal />
      <SuperadminCommunicationNotificationCenterDetailModal />
      <SuperadminCommunicationNotificationCenterTemplateModal />
    </div>
  );
}
