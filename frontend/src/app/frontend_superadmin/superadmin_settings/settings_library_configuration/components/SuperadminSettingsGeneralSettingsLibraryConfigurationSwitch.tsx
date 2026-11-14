'use client';
/** Responsibility: Superadmin System Switch; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSettingsGeneralSettingsLibraryConfigurationSwitch formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/utils/SuperadminSettingsGeneralSettingsLibraryConfigurationClassNameUtilities';
import type { SuperadminSystemSwitchProps } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/types/SuperadminSettingsGeneralSettingsLibraryConfigurationSwitchComponentTypes';

/**
 * Performs the superadmin settings general settings library configuration switch operation within settings general; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemSwitchProps.
 */
export function SuperadminSettingsGeneralSettingsLibraryConfigurationSwitch({ checked, onCheckedChange, disabled, id, className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, title, 'data-testid': dataTestId }: SuperadminSystemSwitchProps) {
  return <button type="button" role="switch" id={id} aria-checked={checked} disabled={disabled} onClick={() => onCheckedChange(!checked)} className={cn('sys-switch', className)} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-describedby={ariaDescribedBy} title={title} data-testid={dataTestId}><span className="sys-switch-thumb" aria-hidden="true" /></button>;
}
