/** Responsibility: Route adapter for the library_capacity_scaling_recommendations screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `auto_scale` inside the library_capacity_scaling_recommendations autonomous module. */
import SuperadminSystemAutoScalePageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsScreen({ id }: { id?: string }) {
  return <SuperadminSystemAutoScalePageClient />;
}
