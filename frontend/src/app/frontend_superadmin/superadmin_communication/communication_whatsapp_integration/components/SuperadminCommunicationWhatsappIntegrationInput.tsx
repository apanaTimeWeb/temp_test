'use client';
/** Responsibility: SuperadminCommunicationWhatsappIntegrationInput; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: owning integration form -> explicit typed field props -> native input attributes and caller change handlers; validation and submission remain with the owning form/hook. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/utils/SuperadminCommunicationWhatsappIntegrationClassNameUtilities';
import type { SuperadminCommunicationWhatsappIntegrationInputProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationInputComponentTypes';

export const SuperadminCommunicationWhatsappIntegrationInput = forwardRef<HTMLInputElement, SuperadminCommunicationWhatsappIntegrationInputProps>(
  ({ className, type = 'text', id, name, value, defaultValue, placeholder, disabled, required, autoComplete, min, max, step, maxLength, readOnly, checked, pattern, inputMode, onChange, onBlur, onFocus, onKeyDown, onInput, title, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, 'aria-label': ariaLabel, 'aria-required': ariaRequired, 'data-testid': dataTestId }, ref) => (
    <input type={type} ref={ref} id={id} name={name} value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} required={required} autoComplete={autoComplete} min={min} max={max} step={step} maxLength={maxLength} readOnly={readOnly} checked={checked} pattern={pattern} inputMode={inputMode} onChange={onChange} onBlur={onBlur} onFocus={onFocus} onKeyDown={onKeyDown} onInput={onInput} title={title} aria-describedby={ariaDescribedBy} aria-invalid={ariaInvalid} aria-label={ariaLabel} aria-required={ariaRequired} className={cn('sys-input', className)} data-testid={dataTestId} />
  ),
);
SuperadminCommunicationWhatsappIntegrationInput.displayName = 'SuperadminCommunicationWhatsappIntegrationInput';
