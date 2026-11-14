'use client';
/** Responsibility: SuperadminLibrariesOverviewLibraryCapacityGapFillingLabel; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewLibraryCapacityGapFillingLabel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/utils/SuperadminLibrariesOverviewLibraryCapacityGapFillingClassNameUtilities';
import type { SuperadminLibrariesOverviewLibraryCapacityGapFillingLabelProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/types/SuperadminLibrariesOverviewLibraryCapacityGapFillingLabelComponentTypes';

export const SuperadminLibrariesOverviewLibraryCapacityGapFillingLabel = forwardRef<HTMLLabelElement, SuperadminLibrariesOverviewLibraryCapacityGapFillingLabelProps>(
  ({ className, htmlFor, id, title, onClick, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <label ref={ref} htmlFor={htmlFor} id={id} title={title} onClick={onClick} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} data-testid={dataTestId} className={cn('sys-label', className)}>{children}</label>
  ),
);
SuperadminLibrariesOverviewLibraryCapacityGapFillingLabel.displayName = 'SuperadminLibrariesOverviewLibraryCapacityGapFillingLabel';
