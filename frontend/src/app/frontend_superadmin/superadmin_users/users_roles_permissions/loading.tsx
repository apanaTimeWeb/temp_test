// RESPONSIBILITY: Render the route loading state for users roles permissions; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_users/users_roles_permissions/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminUsersRolesPermissionsListSkeleton from './components/SuperadminUsersRolesPermissionsListSkeleton';

/**
 * Performs the module loading operation within users roles permissions; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminUsersRolesPermissionsListSkeleton />;
}
