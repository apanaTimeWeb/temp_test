'use client';
/** Responsibility: SuperadminSettingsGeneralSettingsLibraryConfigurationInput; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSettingsGeneralSettingsLibraryConfigurationInput formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/utils/SuperadminSettingsGeneralSettingsLibraryConfigurationClassNameUtilities';
import type { SuperadminSettingsGeneralSettingsLibraryConfigurationInputProps } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/types/SuperadminSettingsGeneralSettingsLibraryConfigurationInputComponentTypes';

export const SuperadminSettingsGeneralSettingsLibraryConfigurationInput = forwardRef<HTMLInputElement, SuperadminSettingsGeneralSettingsLibraryConfigurationInputProps>(
  ({ className, type = 'text', id, name, value, defaultValue, placeholder, disabled, required, autoComplete, min, max, step, maxLength, readOnly, checked, pattern, inputMode, onChange, onBlur, onFocus, onKeyDown, onInput, title, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, 'aria-label': ariaLabel, 'aria-required': ariaRequired, 'data-testid': dataTestId }, ref) => (
    <input type={type} ref={ref} id={id} name={name} value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} required={required} autoComplete={autoComplete} min={min} max={max} step={step} maxLength={maxLength} readOnly={readOnly} checked={checked} pattern={pattern} inputMode={inputMode} onChange={onChange} onBlur={onBlur} onFocus={onFocus} onKeyDown={onKeyDown} onInput={onInput} title={title} aria-describedby={ariaDescribedBy} aria-invalid={ariaInvalid} aria-label={ariaLabel} aria-required={ariaRequired} className={cn('sys-input', className)} data-testid={dataTestId} />
  ),
);
SuperadminSettingsGeneralSettingsLibraryConfigurationInput.displayName = 'SuperadminSettingsGeneralSettingsLibraryConfigurationInput';
