// RESPONSIBILITY: Render the route error boundary for libraries library capacity analysis; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_libraries/libraries_library_capacity_analysis/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminLibrariesOverviewLibraryCapacityAnalysisErrorFallback from './components/SuperadminLibrariesOverviewLibraryCapacityAnalysisErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminLibrariesOverviewLibraryCapacityAnalysisErrorFallback onRetry={reset} />;
}
