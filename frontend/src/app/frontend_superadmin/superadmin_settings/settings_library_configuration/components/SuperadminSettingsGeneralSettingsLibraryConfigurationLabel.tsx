'use client';
/** Responsibility: SuperadminSettingsGeneralSettingsLibraryConfigurationLabel; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSettingsGeneralSettingsLibraryConfigurationLabel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/utils/SuperadminSettingsGeneralSettingsLibraryConfigurationClassNameUtilities';
import type { SuperadminSettingsGeneralSettingsLibraryConfigurationLabelProps } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/types/SuperadminSettingsGeneralSettingsLibraryConfigurationLabelComponentTypes';

export const SuperadminSettingsGeneralSettingsLibraryConfigurationLabel = forwardRef<HTMLLabelElement, SuperadminSettingsGeneralSettingsLibraryConfigurationLabelProps>(
  ({ className, htmlFor, id, title, onClick, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <label ref={ref} htmlFor={htmlFor} id={id} title={title} onClick={onClick} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} data-testid={dataTestId} className={cn('sys-label', className)}>{children}</label>
  ),
);
SuperadminSettingsGeneralSettingsLibraryConfigurationLabel.displayName = 'SuperadminSettingsGeneralSettingsLibraryConfigurationLabel';
