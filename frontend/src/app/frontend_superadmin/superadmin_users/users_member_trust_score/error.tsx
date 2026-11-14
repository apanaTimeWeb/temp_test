// RESPONSIBILITY: Render the route error boundary for users member trust score; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_users/users_member_trust_score/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminUsersOverviewMemberTrustScoreErrorFallback from './components/SuperadminUsersOverviewMemberTrustScoreErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminUsersOverviewMemberTrustScoreErrorFallback onRetry={reset} />;
}
