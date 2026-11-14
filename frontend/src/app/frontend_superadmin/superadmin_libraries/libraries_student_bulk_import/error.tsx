// RESPONSIBILITY: Render the route error boundary for libraries student bulk import; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_libraries/libraries_student_bulk_import/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminLibrariesOnboardingSetupStudentBulkImportErrorFallback from './components/SuperadminLibrariesOnboardingSetupStudentBulkImportErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminLibrariesOnboardingSetupStudentBulkImportErrorFallback onRetry={reset} />;
}
