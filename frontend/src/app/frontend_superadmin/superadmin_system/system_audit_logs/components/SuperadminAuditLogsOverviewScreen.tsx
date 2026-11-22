/** Responsibility: Route adapter for the audit_logs screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminAuditLogsOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the audit_logs autonomous module. */
import SuperadminAuditLogsOverviewPageClient from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewPageClient';

/**
 * Composes the audit logs screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminAuditLogsOverviewScreen({ id }: { id?: string }) {
  return <SuperadminAuditLogsOverviewPageClient />;
}
