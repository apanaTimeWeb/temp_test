// RESPONSIBILITY: Define compile-time types for libraries facility power management; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_facility_power_management/types/SuperadminLibrariesOverviewFacilityPowerManagementProgressComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminLibrariesOverviewFacilityPowerManagementProgress.tsx. */
export interface SuperadminSystemProgressProps { value: number; max?: number; className?: string; barClassName?: string; ariaLabel: string; }
