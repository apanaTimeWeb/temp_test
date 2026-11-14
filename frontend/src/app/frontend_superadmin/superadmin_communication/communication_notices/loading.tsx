// RESPONSIBILITY: Render the route loading state for communication notices; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_communication/communication_notices/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminCommunicationNoticesListSkeleton from './components/SuperadminCommunicationNoticesListSkeleton';

/**
 * Performs the module loading operation within communication notices; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminCommunicationNoticesListSkeleton />;
}
