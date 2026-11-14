// RESPONSIBILITY: Render the route error boundary for users roles permissions; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_users/users_roles_permissions/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminUsersRolesPermissionsErrorFallback from './components/SuperadminUsersRolesPermissionsErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within users roles permissions; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminUsersRolesPermissionsErrorFallback error={error} reset={reset} />;
}
