// RESPONSIBILITY: Define compile-time types for libraries facility maintenance work orders; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_facility_maintenance_work_orders/types/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardDescriptionComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardDescription.tsx. */
import type { ReactNode } from 'react';

/**
 * Defines the public SuperadminSystemCardDescriptionProps contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property children Child content rendered within the owning component. Declared type: ReactNode.
 * @property className Display label for the owning feature. Declared type: string.
 */
export interface SuperadminSystemCardDescriptionProps { children: ReactNode; className?: string; }
