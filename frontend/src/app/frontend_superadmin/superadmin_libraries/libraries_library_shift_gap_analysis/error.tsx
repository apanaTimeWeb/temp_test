// RESPONSIBILITY: Render the route error boundary for libraries library shift gap analysis; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_libraries/libraries_library_shift_gap_analysis/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminLibrariesOverviewLibraryShiftGapAnalysisErrorFallback from './components/SuperadminLibrariesOverviewLibraryShiftGapAnalysisErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminLibrariesOverviewLibraryShiftGapAnalysisErrorFallback onRetry={reset} />;
}
