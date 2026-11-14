// RESPONSIBILITY: Render the route error boundary for billing member payments collection; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_billing/billing_member_payments_collection/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminBillingOverviewMemberPaymentsCollectionErrorFallback from './components/SuperadminBillingOverviewMemberPaymentsCollectionErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminBillingOverviewMemberPaymentsCollectionErrorFallback onRetry={reset} />;
}
