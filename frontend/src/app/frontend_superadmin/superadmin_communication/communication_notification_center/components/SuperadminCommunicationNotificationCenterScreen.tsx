/** Responsibility: Route adapter for the communication_notification_center screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminCommunicationNotificationCenterScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `notification_center` inside the communication_notification_center autonomous module. */
import SuperadminCommunicationNotificationCenterPageClient from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterPageClient';

/**
 * Composes the communication notification center screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminCommunicationNotificationCenterScreen({ id }: { id?: string }) {
  return <SuperadminCommunicationNotificationCenterPageClient id={id} />;
}
