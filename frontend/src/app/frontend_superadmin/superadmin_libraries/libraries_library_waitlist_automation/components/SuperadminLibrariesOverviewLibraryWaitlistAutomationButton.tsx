'use client';
/** Responsibility: SuperadminLibrariesOverviewLibraryWaitlistAutomationButton; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewLibraryWaitlistAutomationButton formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/utils/SuperadminLibrariesOverviewLibraryWaitlistAutomationClassNameUtilities';
import { SUPERADMIN_SYSTEM_BUTTON_SIZE } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/constants/SuperadminLibrariesOverviewLibraryWaitlistAutomationStaticConstants';
import { SUPERADMIN_SYSTEM_BUTTON_VARIANT } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/constants/SuperadminLibrariesOverviewLibraryWaitlistAutomationStaticConstants';
import type { SuperadminLibrariesOverviewLibraryWaitlistAutomationButtonProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/types/SuperadminLibrariesOverviewLibraryWaitlistAutomationButtonComponentTypes';

export const SuperadminLibrariesOverviewLibraryWaitlistAutomationButton = forwardRef<HTMLButtonElement, SuperadminLibrariesOverviewLibraryWaitlistAutomationButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', id, name, value, form, title, disabled, onClick, onKeyDown, onMouseDown, onFocus, onBlur, tabIndex, 'aria-label': ariaLabel, 'aria-pressed': ariaPressed, 'aria-expanded': ariaExpanded, 'aria-controls': ariaControls, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <button type={type} ref={ref} id={id} name={name} value={value} form={form} disabled={disabled} title={title} aria-label={ariaLabel} aria-pressed={ariaPressed} aria-expanded={ariaExpanded} aria-controls={ariaControls} aria-describedby={ariaDescribedBy} onClick={onClick} onKeyDown={onKeyDown} onMouseDown={onMouseDown} onFocus={onFocus} onBlur={onBlur} tabIndex={tabIndex} className={cn(SUPERADMIN_SYSTEM_BUTTON_VARIANT[variant], SUPERADMIN_SYSTEM_BUTTON_SIZE[size], className)} data-testid={dataTestId}>{children}</button>
  ),
);
SuperadminLibrariesOverviewLibraryWaitlistAutomationButton.displayName = 'SuperadminLibrariesOverviewLibraryWaitlistAutomationButton';
