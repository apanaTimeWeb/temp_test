/** Responsibility: Route adapter for the libraries_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the libraries_overview autonomous module. */
import SuperadminLibrariesOverviewPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewPageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOverviewPageClient />;
}
