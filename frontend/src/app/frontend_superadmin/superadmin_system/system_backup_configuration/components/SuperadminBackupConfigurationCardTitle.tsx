/** Responsibility: SuperadminBackupConfigurationCardTitle; module-owned presentation component for backup_configuration. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminBackupConfigurationCardTitle formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/utils/SuperadminBackupConfigurationClassNameUtilities';
import type { SuperadminSystemCardTitleProps } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationCardTitleComponentTypes';

/**
 * Performs the superadmin backup configuration card title operation within backup configuration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardTitleProps.
 */
export function SuperadminBackupConfigurationCardTitle({ children, className }: SuperadminSystemCardTitleProps) {
  return <h3 className={cn('sys-card-title', className)}>{children}</h3>;
}
