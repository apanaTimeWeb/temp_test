'use client';
// RESPONSIBILITY: Route adapter client for communication notification center.
// FLOW: Route screen -> SuperadminCommunicationNotificationCenterPageClient -> SuperadminCommunicationNotificationCenterMain.

import SuperadminCommunicationNotificationCenterMain from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterMain';

export default function SuperadminCommunicationNotificationCenterPageClient({ id }: { id?: string } = {}) {
  return <SuperadminCommunicationNotificationCenterMain />;
}
