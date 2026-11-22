'use client';
/** Responsibility: Superadmin System Switch; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: owning backup configuration form -> controlled checked/disabled props -> accessible switch and caller change handler; persistence remains in the owning form/API layer. */
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/utils/SuperadminBackupConfigurationClassNameUtilities';
import type { SuperadminSystemSwitchProps } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationSwitchComponentTypes';

/**
 * Performs the superadmin backup configuration switch operation within backup configuration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemSwitchProps.
 */
export function SuperadminBackupConfigurationSwitch({ checked, onCheckedChange, disabled, id, className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, title, 'data-testid': dataTestId }: SuperadminSystemSwitchProps) {
  return <button type="button" role="switch" id={id} aria-checked={checked} disabled={disabled} onClick={() => onCheckedChange(!checked)} className={cn('sys-switch', className)} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-describedby={ariaDescribedBy} title={title} data-testid={dataTestId}><span className="sys-switch-thumb" aria-hidden="true" /></button>;
}
