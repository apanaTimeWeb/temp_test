// RESPONSIBILITY: Render the route error boundary for subscriptions member subscriptions; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_subscriptions/subscriptions_member_subscriptions/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminSubscriptionsOverviewMemberSubscriptionsErrorFallback from './components/SuperadminSubscriptionsOverviewMemberSubscriptionsErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminSubscriptionsOverviewMemberSubscriptionsErrorFallback onRetry={reset} />;
}
