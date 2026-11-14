// RESPONSIBILITY: Render the route loading state for plans pricing catalog; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_plans/plans_pricing_catalog/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminPlansPricingCatalogListSkeleton from './components/SuperadminPlansPricingCatalogListSkeleton';

/**
 * Performs the module loading operation within plans pricing catalog; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminPlansPricingCatalogListSkeleton />;
}
