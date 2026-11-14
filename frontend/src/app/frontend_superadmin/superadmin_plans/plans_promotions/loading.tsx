// RESPONSIBILITY: Render the route loading state for plans promotions; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_plans/plans_promotions/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminPlansPromotionsListSkeleton from './components/SuperadminPlansPromotionsListSkeleton';

/**
 * Performs the module loading operation within plans promotions; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminPlansPromotionsListSkeleton />;
}
