// RESPONSIBILITY: Render the route error boundary for libraries library capacity gap filling; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_libraries/libraries_library_capacity_gap_filling/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminLibrariesOverviewLibraryCapacityGapFillingErrorFallback from './components/SuperadminLibrariesOverviewLibraryCapacityGapFillingErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminLibrariesOverviewLibraryCapacityGapFillingErrorFallback onRetry={reset} />;
}
