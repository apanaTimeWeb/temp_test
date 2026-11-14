/** Responsibility: Route adapter for the library_capacity_gap_filling screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewLibraryCapacityGapFillingScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `gap_filling` inside the library_capacity_gap_filling autonomous module. */
import SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewLibraryCapacityGapFillingScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient />;
}
