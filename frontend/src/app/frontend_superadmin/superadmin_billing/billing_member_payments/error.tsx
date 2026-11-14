// RESPONSIBILITY: Render the route error boundary for billing member payments; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_billing/billing_member_payments/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminBillingOverviewMemberPaymentsErrorFallback from './components/SuperadminBillingOverviewMemberPaymentsErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminBillingOverviewMemberPaymentsErrorFallback onRetry={reset} />;
}
