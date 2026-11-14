// RESPONSIBILITY: Render the route error boundary for billing member late fees; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_billing/billing_member_late_fees/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminBillingOverviewMemberLateFeesErrorFallback from './components/SuperadminBillingOverviewMemberLateFeesErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminBillingOverviewMemberLateFeesErrorFallback onRetry={reset} />;
}
