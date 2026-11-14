'use client';
/** Responsibility: SuperadminCommunicationWhatsappIntegrationButton; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: owning integration screen -> explicit typed button props -> native button attributes and caller event handlers; this primitive performs no API request or persistence. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/utils/SuperadminCommunicationWhatsappIntegrationClassNameUtilities';
import { SUPERADMIN_SYSTEM_BUTTON_SIZE } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationStaticConstants';
import { SUPERADMIN_SYSTEM_BUTTON_VARIANT } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationStaticConstants';
import type { SuperadminCommunicationWhatsappIntegrationButtonProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationButtonComponentTypes';

export const SuperadminCommunicationWhatsappIntegrationButton = forwardRef<HTMLButtonElement, SuperadminCommunicationWhatsappIntegrationButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', id, name, value, form, title, disabled, onClick, onKeyDown, onMouseDown, onFocus, onBlur, tabIndex, 'aria-label': ariaLabel, 'aria-pressed': ariaPressed, 'aria-expanded': ariaExpanded, 'aria-controls': ariaControls, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <button type={type} ref={ref} id={id} name={name} value={value} form={form} disabled={disabled} title={title} aria-label={ariaLabel} aria-pressed={ariaPressed} aria-expanded={ariaExpanded} aria-controls={ariaControls} aria-describedby={ariaDescribedBy} onClick={onClick} onKeyDown={onKeyDown} onMouseDown={onMouseDown} onFocus={onFocus} onBlur={onBlur} tabIndex={tabIndex} className={cn(SUPERADMIN_SYSTEM_BUTTON_VARIANT[variant], SUPERADMIN_SYSTEM_BUTTON_SIZE[size], className)} data-testid={dataTestId}>{children}</button>
  ),
);
SuperadminCommunicationWhatsappIntegrationButton.displayName = 'SuperadminCommunicationWhatsappIntegrationButton';
