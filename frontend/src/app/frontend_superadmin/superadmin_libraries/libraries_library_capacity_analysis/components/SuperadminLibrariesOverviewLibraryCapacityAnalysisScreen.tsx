/** Responsibility: Route adapter for the library_capacity_analysis screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewLibraryCapacityAnalysisScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `seat_gap_report` inside the library_capacity_analysis autonomous module. */
import SuperadminLibrariesOverviewLibraryCapacityAnalysisPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/components/SuperadminLibrariesOverviewLibraryCapacityAnalysisPageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewLibraryCapacityAnalysisScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOverviewLibraryCapacityAnalysisPageClient />;
}
