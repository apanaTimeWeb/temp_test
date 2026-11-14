// RESPONSIBILITY: Render the route loading state for billing overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_billing/billing_overview/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminBillingOverviewListSkeleton from './components/SuperadminBillingOverviewListSkeleton';

/**
 * Performs the module loading operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminBillingOverviewListSkeleton />;
}
