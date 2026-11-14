// RESPONSIBILITY: Render the route error boundary for libraries facility maintenance work orders; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_libraries/libraries_facility_maintenance_work_orders/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersErrorFallback from './components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersErrorFallback onRetry={reset} />;
}
