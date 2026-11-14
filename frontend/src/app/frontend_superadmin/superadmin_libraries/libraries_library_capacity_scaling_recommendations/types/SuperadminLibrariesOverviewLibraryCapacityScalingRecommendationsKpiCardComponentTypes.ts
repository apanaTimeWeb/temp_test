// RESPONSIBILITY: Define compile-time types for libraries library capacity scaling recommendations; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_library_capacity_scaling_recommendations/types/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsKpiCardComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsKpiCard.tsx. */
export interface SuperadminSystemKpiCardProps {
  title: string; value: string | number; subtitle?: string; icon?: string;
  trend?: 'up' | 'down' | 'neutral'; trendLabel?: string; className?: string;
}
