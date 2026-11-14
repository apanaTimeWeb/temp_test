// RESPONSIBILITY: Render the route loading state for support complaints; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_support/support_complaints/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSupportComplaintsListSkeleton from './components/SuperadminSupportComplaintsListSkeleton';

/**
 * Performs the module loading operation within support complaints; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSupportComplaintsListSkeleton />;
}
