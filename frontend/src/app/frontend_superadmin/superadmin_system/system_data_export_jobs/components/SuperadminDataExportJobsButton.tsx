'use client';
/** Responsibility: SuperadminDataExportJobsButton; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: owning export-job view -> explicit button props -> native button and caller callback; disabled contract-gated actions do not start a real export. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/utils/SuperadminDataExportJobsClassNameUtilities';
import { SUPERADMIN_SYSTEM_BUTTON_SIZE } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/constants/SuperadminDataExportJobsStaticConstants';
import { SUPERADMIN_SYSTEM_BUTTON_VARIANT } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/constants/SuperadminDataExportJobsStaticConstants';
import type { SuperadminDataExportJobsButtonProps } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/types/SuperadminDataExportJobsButtonComponentTypes';

export const SuperadminDataExportJobsButton = forwardRef<HTMLButtonElement, SuperadminDataExportJobsButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', id, name, value, form, title, disabled, onClick, onKeyDown, onMouseDown, onFocus, onBlur, tabIndex, 'aria-label': ariaLabel, 'aria-pressed': ariaPressed, 'aria-expanded': ariaExpanded, 'aria-controls': ariaControls, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <button type={type} ref={ref} id={id} name={name} value={value} form={form} disabled={disabled} title={title} aria-label={ariaLabel} aria-pressed={ariaPressed} aria-expanded={ariaExpanded} aria-controls={ariaControls} aria-describedby={ariaDescribedBy} onClick={onClick} onKeyDown={onKeyDown} onMouseDown={onMouseDown} onFocus={onFocus} onBlur={onBlur} tabIndex={tabIndex} className={cn(SUPERADMIN_SYSTEM_BUTTON_VARIANT[variant], SUPERADMIN_SYSTEM_BUTTON_SIZE[size], className)} data-testid={dataTestId}>{children}</button>
  ),
);
SuperadminDataExportJobsButton.displayName = 'SuperadminDataExportJobsButton';
