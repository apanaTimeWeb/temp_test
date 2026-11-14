// RESPONSIBILITY: Render the route loading state for users member trust score; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_users/users_member_trust_score/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminUsersOverviewMemberTrustScoreRouteSkeleton from './components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminUsersOverviewMemberTrustScoreRouteSkeleton />;
}
