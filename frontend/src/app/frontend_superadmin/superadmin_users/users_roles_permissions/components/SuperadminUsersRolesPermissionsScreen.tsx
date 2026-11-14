/** Responsibility: isolated route adapter for the Roles & Permissions workflow. */
/** Data-Flow: canonical route props -> SuperadminUsersRolesPermissionsScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminUsersRolesPermissionsPageClient from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminUsersRolesPermissionsPageClient.tsx';

/**
 * Composes the users roles permissions screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminUsersRolesPermissionsScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminUsersRolesPermissionsPageClient />;
}
