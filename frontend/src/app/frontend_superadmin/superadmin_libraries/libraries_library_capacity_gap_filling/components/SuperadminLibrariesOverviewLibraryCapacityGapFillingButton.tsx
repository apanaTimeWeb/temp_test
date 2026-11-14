'use client';
/** Responsibility: SuperadminLibrariesOverviewLibraryCapacityGapFillingButton; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewLibraryCapacityGapFillingButton formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/utils/SuperadminLibrariesOverviewLibraryCapacityGapFillingClassNameUtilities';
import { SUPERADMIN_SYSTEM_BUTTON_SIZE } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/constants/SuperadminLibrariesOverviewLibraryCapacityGapFillingStaticConstants';
import { SUPERADMIN_SYSTEM_BUTTON_VARIANT } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/constants/SuperadminLibrariesOverviewLibraryCapacityGapFillingStaticConstants';
import type { SuperadminLibrariesOverviewLibraryCapacityGapFillingButtonProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/types/SuperadminLibrariesOverviewLibraryCapacityGapFillingButtonComponentTypes';

export const SuperadminLibrariesOverviewLibraryCapacityGapFillingButton = forwardRef<HTMLButtonElement, SuperadminLibrariesOverviewLibraryCapacityGapFillingButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', id, name, value, form, title, disabled, onClick, onKeyDown, onMouseDown, onFocus, onBlur, tabIndex, 'aria-label': ariaLabel, 'aria-pressed': ariaPressed, 'aria-expanded': ariaExpanded, 'aria-controls': ariaControls, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <button type={type} ref={ref} id={id} name={name} value={value} form={form} disabled={disabled} title={title} aria-label={ariaLabel} aria-pressed={ariaPressed} aria-expanded={ariaExpanded} aria-controls={ariaControls} aria-describedby={ariaDescribedBy} onClick={onClick} onKeyDown={onKeyDown} onMouseDown={onMouseDown} onFocus={onFocus} onBlur={onBlur} tabIndex={tabIndex} className={cn(SUPERADMIN_SYSTEM_BUTTON_VARIANT[variant], SUPERADMIN_SYSTEM_BUTTON_SIZE[size], className)} data-testid={dataTestId}>{children}</button>
  ),
);
SuperadminLibrariesOverviewLibraryCapacityGapFillingButton.displayName = 'SuperadminLibrariesOverviewLibraryCapacityGapFillingButton';
