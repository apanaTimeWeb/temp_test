'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_security/security_audit_logs; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';

export default function ModuleLoading() {
  return (
    <SuperadminPageLoader
      size="md"
      icon="shield"
      variant="contra"
      label="Loading Security Audit Logs..."
    />
  );
}
