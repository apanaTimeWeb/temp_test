// RESPONSIBILITY: Render the route loading state for users overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_users/users_overview/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminUsersOverviewListSkeleton from './components/SuperadminUsersOverviewListSkeleton';

/**
 * Performs the module loading operation within users overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminUsersOverviewListSkeleton />;
}
