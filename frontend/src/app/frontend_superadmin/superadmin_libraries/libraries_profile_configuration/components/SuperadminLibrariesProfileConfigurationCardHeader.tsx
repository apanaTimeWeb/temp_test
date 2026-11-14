/** Responsibility: SuperadminLibrariesProfileConfigurationCardHeader; module-owned presentation component for libraries_profile_configuration. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesProfileConfigurationCardHeader formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/utils/SuperadminLibrariesProfileConfigurationClassNameUtilities';
import type { SuperadminSystemCardHeaderProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/types/SuperadminLibrariesProfileConfigurationCardHeaderComponentTypes';

/**
 * Performs the superadmin libraries profile configuration card header operation within libraries profile configuration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardHeaderProps.
 */
export function SuperadminLibrariesProfileConfigurationCardHeader({ children, className }: SuperadminSystemCardHeaderProps) {
  return <div className={cn('sys-card-header', className)}>{children}</div>;
}
