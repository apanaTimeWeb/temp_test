/** Responsibility: Route adapter for the library_shift_gap_analysis screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewLibraryShiftGapAnalysisScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `shift_gap_analyzer` inside the library_shift_gap_analysis autonomous module. */
import SuperadminLibrariesOverviewLibraryShiftGapAnalysisPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_shift_gap_analysis/components/SuperadminLibrariesOverviewLibraryShiftGapAnalysisPageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewLibraryShiftGapAnalysisScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOverviewLibraryShiftGapAnalysisPageClient />;
}
