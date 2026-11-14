/** Responsibility: Route adapter for the users_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminUsersOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the users_overview autonomous module. */
import SuperadminUsersOverviewPageClient from '@/app/frontend_superadmin/superadmin_users/users_overview/components/SuperadminUsersOverviewPageClient';

/**
 * Composes the users overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminUsersOverviewScreen({ id }: { id?: string }) {
  return <SuperadminUsersOverviewPageClient />;
}
