/** Responsibility: Route adapter for the member_referrals screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminUsersOverviewMemberReferralsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `referrals` inside the member_referrals autonomous module. */
import SuperadminUsersOverviewMemberReferralsPageClient from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/components/SuperadminUsersOverviewMemberReferralsPageClient';

/**
 * Composes the users overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminUsersOverviewMemberReferralsScreen({ id }: { id?: string }) {
  return <SuperadminUsersOverviewMemberReferralsPageClient />;
}
