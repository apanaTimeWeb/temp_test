/** Responsibility: SuperadminLibrariesOverviewFacilityPowerManagementCardTitle; module-owned presentation component for facility_power_management. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewFacilityPowerManagementCardTitle formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/utils/SuperadminLibrariesOverviewFacilityPowerManagementClassNameUtilities';
import type { SuperadminSystemCardTitleProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/types/SuperadminLibrariesOverviewFacilityPowerManagementCardTitleComponentTypes';

/**
 * Performs the superadmin libraries overview facility power management card title operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardTitleProps.
 */
export function SuperadminLibrariesOverviewFacilityPowerManagementCardTitle({ children, className }: SuperadminSystemCardTitleProps) {
  return <h3 className={cn('sys-card-title', className)}>{children}</h3>;
}
