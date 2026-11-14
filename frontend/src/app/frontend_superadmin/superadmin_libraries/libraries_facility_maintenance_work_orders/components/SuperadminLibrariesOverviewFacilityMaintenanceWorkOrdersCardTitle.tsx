/** Responsibility: SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardTitle; module-owned presentation component for facility_maintenance_work_orders. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardTitle formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/utils/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersClassNameUtilities';
import type { SuperadminSystemCardTitleProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/types/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardTitleComponentTypes';

/**
 * Performs the superadmin libraries overview facility maintenance work orders card title operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardTitleProps.
 */
export function SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardTitle({ children, className }: SuperadminSystemCardTitleProps) {
  return <h3 className={cn('sys-card-title', className)}>{children}</h3>;
}
