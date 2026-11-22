'use client';
/** Responsibility: SuperadminBackupConfigurationButton; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: owning backup configuration panel -> explicit button props -> native button and caller event handlers; backup execution is not implemented by this primitive. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/utils/SuperadminBackupConfigurationClassNameUtilities';
import { SUPERADMIN_SYSTEM_BUTTON_SIZE } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/constants/SuperadminBackupConfigurationStaticConstants';
import { SUPERADMIN_SYSTEM_BUTTON_VARIANT } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/constants/SuperadminBackupConfigurationStaticConstants';
import type { SuperadminBackupConfigurationButtonProps } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationButtonComponentTypes';

export const SuperadminBackupConfigurationButton = forwardRef<HTMLButtonElement, SuperadminBackupConfigurationButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', id, name, value, form, title, disabled, onClick, onKeyDown, onMouseDown, onFocus, onBlur, tabIndex, 'aria-label': ariaLabel, 'aria-pressed': ariaPressed, 'aria-expanded': ariaExpanded, 'aria-controls': ariaControls, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <button type={type} ref={ref} id={id} name={name} value={value} form={form} disabled={disabled} title={title} aria-label={ariaLabel} aria-pressed={ariaPressed} aria-expanded={ariaExpanded} aria-controls={ariaControls} aria-describedby={ariaDescribedBy} onClick={onClick} onKeyDown={onKeyDown} onMouseDown={onMouseDown} onFocus={onFocus} onBlur={onBlur} tabIndex={tabIndex} className={cn(SUPERADMIN_SYSTEM_BUTTON_VARIANT[variant], SUPERADMIN_SYSTEM_BUTTON_SIZE[size], className)} data-testid={dataTestId}>{children}</button>
  ),
);
SuperadminBackupConfigurationButton.displayName = 'SuperadminBackupConfigurationButton';
