/** Responsibility: isolated route adapter for the Active Sessions workflow. */
/** Data-Flow: canonical route props -> SuperadminProfileActiveSessionsScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminProfileActiveSessionsPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_profile_active_sessions/components/SuperadminProfileActiveSessionsPageClient.tsx';

/**
 * Composes the profile active sessions screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminProfileActiveSessionsScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminProfileActiveSessionsPageClient />;
}
