'use client';
/** Responsibility: SuperadminLibrariesOnboardingSetupStudentSmartIdButton; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: onboarding step supplies explicit button props -> native button and event callback -> owning step manages any preview behavior; this component does not persist or mint an authoritative identifier. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/utils/SuperadminLibrariesOnboardingSetupStudentSmartIdClassNameUtilities';
import { SUPERADMIN_SYSTEM_BUTTON_SIZE } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/constants/SuperadminLibrariesOnboardingSetupStudentSmartIdStaticConstants';
import { SUPERADMIN_SYSTEM_BUTTON_VARIANT } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/constants/SuperadminLibrariesOnboardingSetupStudentSmartIdStaticConstants';
import type { SuperadminLibrariesOnboardingSetupStudentSmartIdButtonProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/types/SuperadminLibrariesOnboardingSetupStudentSmartIdButtonComponentTypes';

export const SuperadminLibrariesOnboardingSetupStudentSmartIdButton = forwardRef<HTMLButtonElement, SuperadminLibrariesOnboardingSetupStudentSmartIdButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', id, name, value, form, title, disabled, onClick, onKeyDown, onMouseDown, onFocus, onBlur, tabIndex, 'aria-label': ariaLabel, 'aria-pressed': ariaPressed, 'aria-expanded': ariaExpanded, 'aria-controls': ariaControls, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <button type={type} ref={ref} id={id} name={name} value={value} form={form} disabled={disabled} title={title} aria-label={ariaLabel} aria-pressed={ariaPressed} aria-expanded={ariaExpanded} aria-controls={ariaControls} aria-describedby={ariaDescribedBy} onClick={onClick} onKeyDown={onKeyDown} onMouseDown={onMouseDown} onFocus={onFocus} onBlur={onBlur} tabIndex={tabIndex} className={cn(SUPERADMIN_SYSTEM_BUTTON_VARIANT[variant], SUPERADMIN_SYSTEM_BUTTON_SIZE[size], className)} data-testid={dataTestId}>{children}</button>
  ),
);
SuperadminLibrariesOnboardingSetupStudentSmartIdButton.displayName = 'SuperadminLibrariesOnboardingSetupStudentSmartIdButton';
