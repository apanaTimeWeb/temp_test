/** Responsibility: Route adapter for the member_trust_score screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminUsersOverviewMemberTrustScoreScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `trust_score` inside the member_trust_score autonomous module. */
import SuperadminUsersOverviewMemberTrustScorePageClient from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/components/SuperadminUsersOverviewMemberTrustScorePageClient';

/**
 * Composes the users overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminUsersOverviewMemberTrustScoreScreen({ id }: { id?: string }) {
  return <SuperadminUsersOverviewMemberTrustScorePageClient />;
}
