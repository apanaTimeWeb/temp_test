/** Responsibility: Route adapter for the library_offline_operations screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewLibraryOfflineOperationsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `offline` inside the library_offline_operations autonomous module. */
import SuperadminLibrariesOverviewLibraryOfflineOperationsPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_offline_operations/components/SuperadminLibrariesOverviewLibraryOfflineOperationsPageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewLibraryOfflineOperationsScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOverviewLibraryOfflineOperationsPageClient />;
}
