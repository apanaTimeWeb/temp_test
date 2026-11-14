// RESPONSIBILITY: Render the route error boundary for subscriptions member auto suspend policy; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_subscriptions/subscriptions_member_auto_suspend_policy/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyErrorFallback from './components/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyErrorFallback onRetry={reset} />;
}
