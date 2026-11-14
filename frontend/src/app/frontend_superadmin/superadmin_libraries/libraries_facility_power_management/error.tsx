// RESPONSIBILITY: Render the route error boundary for libraries facility power management; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_libraries/libraries_facility_power_management/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminLibrariesOverviewFacilityPowerManagementErrorFallback from './components/SuperadminLibrariesOverviewFacilityPowerManagementErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminLibrariesOverviewFacilityPowerManagementErrorFallback onRetry={reset} />;
}
