'use client';
/** Responsibility: SuperadminCommunicationWhatsappIntegrationLabel; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: owning integration form -> label text and association props -> accessible label element; field state remains owned by the form. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/utils/SuperadminCommunicationWhatsappIntegrationClassNameUtilities';
import type { SuperadminCommunicationWhatsappIntegrationLabelProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationLabelComponentTypes';

export const SuperadminCommunicationWhatsappIntegrationLabel = forwardRef<HTMLLabelElement, SuperadminCommunicationWhatsappIntegrationLabelProps>(
  ({ className, htmlFor, id, title, onClick, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <label ref={ref} htmlFor={htmlFor} id={id} title={title} onClick={onClick} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} data-testid={dataTestId} className={cn('sys-label', className)}>{children}</label>
  ),
);
SuperadminCommunicationWhatsappIntegrationLabel.displayName = 'SuperadminCommunicationWhatsappIntegrationLabel';
