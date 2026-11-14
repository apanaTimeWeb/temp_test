// RESPONSIBILITY: Render the route error boundary for billing member finance overview; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_billing/billing_member_finance_overview/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminBillingOverviewMemberFinanceOverviewErrorFallback from './components/SuperadminBillingOverviewMemberFinanceOverviewErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminBillingOverviewMemberFinanceOverviewErrorFallback onRetry={reset} />;
}
