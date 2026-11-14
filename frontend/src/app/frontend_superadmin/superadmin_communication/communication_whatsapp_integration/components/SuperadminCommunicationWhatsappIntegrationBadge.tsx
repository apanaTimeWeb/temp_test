'use client';
/** Responsibility: SuperadminCommunicationWhatsappIntegrationBadge; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: owning integration screen -> status/variant props -> semantic localized badge presentation; it does not derive connection state or call a provider API. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/utils/SuperadminCommunicationWhatsappIntegrationClassNameUtilities';
import { SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationStaticConstants';
import type { SuperadminCommunicationWhatsappIntegrationBadgeProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationBadgeComponentTypes';

/** Renders a semantic badge using only explicitly supported attributes. */
export function SuperadminCommunicationWhatsappIntegrationBadge({ className, variant = 'default', id, title, role, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, 'aria-live': ariaLive, 'data-testid': dataTestId, children }: SuperadminCommunicationWhatsappIntegrationBadgeProps) {
  return <span id={id} title={title} role={role} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} aria-live={ariaLive} data-testid={dataTestId} className={cn('sys-badge', SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS[variant] ?? 'sys-badge--outline', className)}>{children}</span>;
}
