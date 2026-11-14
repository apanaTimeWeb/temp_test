// RESPONSIBILITY: Render the route loading state for communication notification center; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_communication/communication_notification_center/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminCommunicationNotificationCenterListSkeleton from './components/SuperadminCommunicationNotificationCenterListSkeleton';

/**
 * Performs the module loading operation within communication notification center; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminCommunicationNotificationCenterListSkeleton />;
}
