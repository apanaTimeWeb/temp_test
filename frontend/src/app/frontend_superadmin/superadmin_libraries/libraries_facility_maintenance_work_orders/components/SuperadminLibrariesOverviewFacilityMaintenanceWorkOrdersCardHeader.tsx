/** Responsibility: SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardHeader; module-owned presentation component for facility_maintenance_work_orders. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardHeader formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/utils/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersClassNameUtilities';
import type { SuperadminSystemCardHeaderProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/types/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardHeaderComponentTypes';

/**
 * Performs the superadmin libraries overview facility maintenance work orders card header operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardHeaderProps.
 */
export function SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardHeader({ children, className }: SuperadminSystemCardHeaderProps) {
  return <div className={cn('sys-card-header', className)}>{children}</div>;
}
