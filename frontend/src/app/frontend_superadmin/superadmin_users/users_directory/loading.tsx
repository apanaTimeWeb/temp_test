// RESPONSIBILITY: Render the route loading state for users directory; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_users/users_directory/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminUsersDirectoryListSkeleton from './components/SuperadminUsersDirectoryListSkeleton';

/**
 * Performs the module loading operation within users directory; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminUsersDirectoryListSkeleton />;
}
