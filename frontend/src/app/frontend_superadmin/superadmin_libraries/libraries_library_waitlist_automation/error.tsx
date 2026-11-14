// RESPONSIBILITY: Render the route error boundary for libraries library waitlist automation; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_libraries/libraries_library_waitlist_automation/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminLibrariesOverviewLibraryWaitlistAutomationErrorFallback from './components/SuperadminLibrariesOverviewLibraryWaitlistAutomationErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminLibrariesOverviewLibraryWaitlistAutomationErrorFallback onRetry={reset} />;
}
