// RESPONSIBILITY: Define compile-time types for libraries facility maintenance work orders; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_facility_maintenance_work_orders/types/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersKpiCardComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersKpiCard.tsx. */
export interface SuperadminSystemKpiCardProps {
  title: string; value: string | number; subtitle?: string; icon?: string;
  trend?: 'up' | 'down' | 'neutral'; trendLabel?: string; className?: string;
}
