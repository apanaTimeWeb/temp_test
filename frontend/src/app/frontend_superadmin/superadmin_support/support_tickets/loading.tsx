// RESPONSIBILITY: Render the route loading state for support tickets; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_support/support_tickets/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSupportTicketsListSkeleton from './components/SuperadminSupportTicketsListSkeleton';

/**
 * Performs the module loading operation within support tickets; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSupportTicketsListSkeleton />;
}
