// RESPONSIBILITY: Render the route loading state for system audit logs; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_system/system_audit_logs/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAuditLogsListSkeleton from './components/SuperadminAuditLogsListSkeleton';

/**
 * Performs the module loading operation within audit logs; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminAuditLogsListSkeleton />;
}
