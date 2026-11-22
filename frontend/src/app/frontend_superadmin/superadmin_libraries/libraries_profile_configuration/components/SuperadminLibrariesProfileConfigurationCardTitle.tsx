/** Responsibility: SuperadminLibrariesProfileConfigurationCardTitle; module-owned presentation component for libraries_profile_configuration. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesProfileConfigurationCardTitle formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/utils/SuperadminLibrariesProfileConfigurationClassNameUtilities';
import type { SuperadminSystemCardTitleProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/types/SuperadminLibrariesProfileConfigurationCardTitleComponentTypes';

/**
 * Performs the superadmin libraries profile configuration card title operation within libraries profile configuration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardTitleProps.
 */
export function SuperadminLibrariesProfileConfigurationCardTitle({ children, className }: SuperadminSystemCardTitleProps) {
  return <h3 className={cn('sys-card-title text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2.5', className)}>{children}</h3>;
}
