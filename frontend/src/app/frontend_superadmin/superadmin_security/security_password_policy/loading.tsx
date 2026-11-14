// RESPONSIBILITY: Render the route loading state for security password policy; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_security/security_password_policy/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSecurityPasswordPolicyListSkeleton from './components/SuperadminSecurityPasswordPolicyListSkeleton';

/**
 * Performs the module loading operation within security password policy; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSecurityPasswordPolicyListSkeleton />;
}
