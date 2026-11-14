/** Responsibility: isolated route adapter for the Login History workflow. */
/** Data-Flow: canonical route props -> SuperadminProfileLoginHistoryScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminProfileLoginHistoryPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_profile_login_history/components/SuperadminProfileLoginHistoryPageClient.tsx';

/**
 * Composes the profile login history screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminProfileLoginHistoryScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminProfileLoginHistoryPageClient />;
}
