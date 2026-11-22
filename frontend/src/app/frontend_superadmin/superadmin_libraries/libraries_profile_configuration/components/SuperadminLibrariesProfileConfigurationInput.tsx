'use client';
/** Responsibility: SuperadminLibrariesProfileConfigurationInput; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: owning configuration form -> explicit input props -> native input and caller change handlers; validation and persistence remain with the owning form/hook. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/utils/SuperadminLibrariesProfileConfigurationClassNameUtilities';
import type { SuperadminLibrariesProfileConfigurationInputProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/types/SuperadminLibrariesProfileConfigurationInputComponentTypes';

export const SuperadminLibrariesProfileConfigurationInput = forwardRef<HTMLInputElement, SuperadminLibrariesProfileConfigurationInputProps>(
  ({ className, type = 'text', id, name, value, defaultValue, placeholder, disabled, required, autoComplete, min, max, step, maxLength, readOnly, checked, pattern, inputMode, onChange, onBlur, onFocus, onKeyDown, onInput, title, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, 'aria-label': ariaLabel, 'aria-required': ariaRequired, 'data-testid': dataTestId }, ref) => (
    <input
      type={type}
      ref={ref}
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      min={min}
      max={max}
      step={step}
      maxLength={maxLength}
      readOnly={readOnly}
      checked={checked}
      pattern={pattern}
      inputMode={inputMode}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onInput={onInput}
      title={title}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      aria-label={ariaLabel}
      aria-required={ariaRequired}
      className={cn(
        'sys-input w-full rounded-xl border border-indigo-500/25 bg-background/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50',
        ariaInvalid && 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20',
        className
      )}
      data-testid={dataTestId}
    />
  ),
);
SuperadminLibrariesProfileConfigurationInput.displayName = 'SuperadminLibrariesProfileConfigurationInput';
