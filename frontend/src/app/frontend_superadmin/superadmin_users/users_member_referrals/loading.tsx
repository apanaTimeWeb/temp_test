// RESPONSIBILITY: Render the route loading state for users member referrals; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_users/users_member_referrals/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminUsersOverviewMemberReferralsRouteSkeleton from './components/SuperadminUsersOverviewMemberReferralsRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminUsersOverviewMemberReferralsRouteSkeleton />;
}
