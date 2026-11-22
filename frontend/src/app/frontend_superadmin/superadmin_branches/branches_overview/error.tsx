'use client';
// RESPONSIBILITY: Route error boundary for branches overview.
import SuperadminBranchesOverviewErrorFallback from './components/SuperadminBranchesOverviewErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminBranchesOverviewErrorFallback error={error} onRetry={reset} />;
}
