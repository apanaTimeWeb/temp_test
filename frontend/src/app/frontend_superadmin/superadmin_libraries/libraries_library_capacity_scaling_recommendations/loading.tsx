// RESPONSIBILITY: Render the route loading state for libraries library capacity scaling recommendations; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_library_capacity_scaling_recommendations/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton from './components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton />;
}
