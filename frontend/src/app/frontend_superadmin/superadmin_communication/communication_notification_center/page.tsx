// RESPONSIBILITY: Route entry page for Superadmin Notification & Communication Center.
// FLOW: Next.js App Router -> page.tsx -> SuperadminCommunicationNotificationCenterMain.

import SuperadminCommunicationNotificationCenterMain from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterMain';

export const metadata = {
  title: 'Notification & Communication Center | SuperAdmin',
  description: 'Manage global and account-specific notifications across Email, SMS, and WhatsApp with delivery tracking.',
};

export default function CommunicationNotificationCenterPage() {
  return <SuperadminCommunicationNotificationCenterMain />;
}
