'use client';
/** Responsibility: SuperadminLibrariesProfileConfigurationLabel; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: owning configuration form -> label text/association props -> accessible label element; form state and validation remain with the owner. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/utils/SuperadminLibrariesProfileConfigurationClassNameUtilities';
import type { SuperadminLibrariesProfileConfigurationLabelProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/types/SuperadminLibrariesProfileConfigurationLabelComponentTypes';

export const SuperadminLibrariesProfileConfigurationLabel = forwardRef<HTMLLabelElement, SuperadminLibrariesProfileConfigurationLabelProps>(
  ({ className, htmlFor, id, title, onClick, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <label ref={ref} htmlFor={htmlFor} id={id} title={title} onClick={onClick} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} data-testid={dataTestId} className={cn('sys-label', className)}>{children}</label>
  ),
);
SuperadminLibrariesProfileConfigurationLabel.displayName = 'SuperadminLibrariesProfileConfigurationLabel';
