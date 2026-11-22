/** Responsibility: isolated route adapter for the All Users workflow. */
/** Data-Flow: canonical route props -> SuperadminUsersDirectoryScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminUsersDirectoryPageClient from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectoryPageClient.tsx';

/**
 * Composes the users directory screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminUsersDirectoryScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminUsersDirectoryPageClient />;
}
