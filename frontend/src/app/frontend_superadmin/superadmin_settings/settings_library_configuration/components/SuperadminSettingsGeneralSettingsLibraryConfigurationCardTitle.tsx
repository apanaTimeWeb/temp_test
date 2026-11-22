/** Responsibility: SuperadminSettingsGeneralSettingsLibraryConfigurationCardTitle; module-owned presentation component for settings_library_configuration. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSettingsGeneralSettingsLibraryConfigurationCardTitle formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/utils/SuperadminSettingsGeneralSettingsLibraryConfigurationClassNameUtilities';
import type { SuperadminSystemCardTitleProps } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/types/SuperadminSettingsGeneralSettingsLibraryConfigurationCardTitleComponentTypes';

/**
 * Performs the superadmin settings general settings library configuration card title operation within settings general; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardTitleProps.
 */
export function SuperadminSettingsGeneralSettingsLibraryConfigurationCardTitle({ children, className }: SuperadminSystemCardTitleProps) {
  return <h3 className={cn('sys-card-title', className)}>{children}</h3>;
}
