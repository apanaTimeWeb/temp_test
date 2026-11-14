// RESPONSIBILITY: Define compile-time types for communication whatsapp integration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationBadgeComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Explicitly allowlisted native-element props for this feature-local primitive. */
import type { HTMLAttributes, ReactNode } from 'react';
import type { SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationStaticConstants';

/** Badge props are intentionally allowlisted; arbitrary props are not forwarded. */
export interface SuperadminCommunicationWhatsappIntegrationBadgeProps {
  className?: string;
  variant?: keyof typeof SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS;
  id?: string;
  title?: string;
  role?: HTMLAttributes<HTMLSpanElement>['role'];
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-live'?: HTMLAttributes<HTMLSpanElement>['aria-live'];
  'data-testid'?: string;
  children?: ReactNode;
}
