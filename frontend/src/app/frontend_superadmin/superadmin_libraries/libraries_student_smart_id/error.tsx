// RESPONSIBILITY: Render the route error boundary for libraries student smart id; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_libraries/libraries_student_smart_id/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminLibrariesOnboardingSetupStudentSmartIdErrorFallback from './components/SuperadminLibrariesOnboardingSetupStudentSmartIdErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminLibrariesOnboardingSetupStudentSmartIdErrorFallback onRetry={reset} />;
}
