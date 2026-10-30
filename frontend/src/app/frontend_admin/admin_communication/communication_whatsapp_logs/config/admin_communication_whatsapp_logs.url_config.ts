

/**
 * Canonical UI/API contract for admin_communication_whatsapp_logs.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_COMMUNICATION_WHATSAPP_LOGS_ROUTES = {
  ROOT: '/admin/admin_communication/communication_whatsapp_logs',
} as const;

export const ADMIN_COMMUNICATION_WHATSAPP_LOGS_API = {
  /** No verified feature-specific API endpoint/operation was supplied. */
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_COMMUNICATION_WHATSAPP_LOGS_CANONICAL_ROUTE = ADMIN_COMMUNICATION_WHATSAPP_LOGS_ROUTES.ROOT;

export const ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_BADGE: Record<string, string> = {
  welcome: 'bg-info-bg text-info-text border-info-bg',
  fee_reminder: 'bg-warning-bg text-warning-text border-warning-bg',
  receipt: 'bg-success-bg text-success-text border-success-bg',
  notice: 'bg-purple-bg text-purple-text',
  renewal: 'bg-primary-subtle text-primary border-primary-subtle',
};

export const ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL: Record<string, string> = {
  welcome: 'WHATSAPP_TYPE_WELCOME',
  fee_reminder: 'WHATSAPP_TYPE_FEE_REMINDER',
  receipt: 'WHATSAPP_TYPE_RECEIPT',
  notice: 'WHATSAPP_TYPE_NOTICE',
  renewal: 'WHATSAPP_TYPE_RENEWAL',
};

export const ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_BADGE: Record<string, string> = {
  Pending: 'bg-warning-bg text-warning-text border-warning-bg',
  Sent: 'bg-info-bg text-info-text border-info-bg',
  Delivered: 'bg-success-bg text-success-text border-success-bg',
  Failed: 'bg-danger-bg text-danger-text border-danger-bg',
};

export const ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL: Record<string, string> = {
  Pending: 'WHATSAPP_STATUS_PENDING',
  Sent: 'WHATSAPP_STATUS_SENT',
  Delivered: 'WHATSAPP_STATUS_DELIVERED',
  Failed: 'WHATSAPP_STATUS_FAILED',
};
