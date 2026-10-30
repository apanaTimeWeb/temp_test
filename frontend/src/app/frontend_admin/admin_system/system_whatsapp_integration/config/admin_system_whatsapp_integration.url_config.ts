import { CheckCircle, Clock, XCircle, type LucideIcon } from 'lucide-react';
import type { AdminSystemWhatsAppMessageLog } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/types/AdminSystemWhatsappIntegrationWhatsAppTypes';
import type { AdminSystemWhatsappIntegrationadmin_system_whatsapp_integration_whats_app_constantsVariant } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/types/AdminSystemWhatsappIntegrationWhatsAppTypes';

/**
 * Canonical UI/API contract for admin_system_whatsapp_integration.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_SYSTEM_WHATSAPP_INTEGRATION_ROUTES = {
  ROOT: '/admin/admin_system/system_whatsapp_integration',
} as const;

export const ADMIN_SYSTEM_WHATSAPP_INTEGRATION_API = {
  /** Source-observed domain API base only; feature operations and response DTOs remain CONTRACT_MISSING. */
  BASE_PATH: '/api/v1/admin/system',
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_SYSTEM_WHATSAPP_INTEGRATION_CANONICAL_ROUTE = ADMIN_SYSTEM_WHATSAPP_INTEGRATION_ROUTES.ROOT;

type AdminSystemWhatsAppDeliveryStatus = AdminSystemWhatsAppMessageLog['status'];

export const ADMIN_SYSTEM_WHATSAPP_STATUS_CONFIG: Record<AdminSystemWhatsAppDeliveryStatus, { variant: AdminSystemWhatsappIntegrationadmin_system_whatsapp_integration_whats_app_constantsVariant; icon: LucideIcon }> = {
  delivered: { variant: 'success', icon: CheckCircle },
  failed: { variant: 'danger', icon: XCircle },
  pending: { variant: 'warning', icon: Clock },
};
