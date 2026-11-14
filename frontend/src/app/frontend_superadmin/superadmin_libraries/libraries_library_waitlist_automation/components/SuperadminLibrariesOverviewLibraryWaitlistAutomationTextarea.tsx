'use client';
/** Responsibility: SuperadminLibrariesOverviewLibraryWaitlistAutomationTextarea; render the named feature UI concern from typed inputs and keep business persistence in the owning leaf API boundary. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewLibraryWaitlistAutomationTextarea formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/utils/SuperadminLibrariesOverviewLibraryWaitlistAutomationClassNameUtilities';
import type { SuperadminLibrariesOverviewLibraryWaitlistAutomationTextareaProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/types/SuperadminLibrariesOverviewLibraryWaitlistAutomationTextareaComponentTypes';

export const SuperadminLibrariesOverviewLibraryWaitlistAutomationTextarea = forwardRef<HTMLTextAreaElement, SuperadminLibrariesOverviewLibraryWaitlistAutomationTextareaProps>(
  ({ className, id, name, value, defaultValue, placeholder, disabled, required, rows, cols, maxLength, readOnly, onChange, onBlur, onFocus, onKeyDown, title, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, 'aria-label': ariaLabel, 'aria-required': ariaRequired, 'data-testid': dataTestId }, ref) => (
    <textarea ref={ref} id={id} name={name} value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} required={required} rows={rows} cols={cols} maxLength={maxLength} readOnly={readOnly} onChange={onChange} onBlur={onBlur} onFocus={onFocus} onKeyDown={onKeyDown} title={title} aria-describedby={ariaDescribedBy} aria-invalid={ariaInvalid} aria-label={ariaLabel} aria-required={ariaRequired} data-testid={dataTestId} className={cn('sys-textarea', className)} />
  ),
);
SuperadminLibrariesOverviewLibraryWaitlistAutomationTextarea.displayName = 'SuperadminLibrariesOverviewLibraryWaitlistAutomationTextarea';
