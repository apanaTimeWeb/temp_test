// constants/superadmin_integrations_overview.constants.ts
// Single source of truth for static configurations, status codes, and enum registries.

export const INTEGRATION_CATEGORIES = [
  { id: 'all', label: 'All Providers', countKey: 'total' },
  { id: 'payment', label: 'Payment Gateways', countKey: 'payment' },
  { id: 'messaging', label: 'SMS & WhatsApp', countKey: 'messaging' },
  { id: 'email', label: 'Email & SMTP', countKey: 'email' },
  { id: 'storage', label: 'Cloud File Storage', countKey: 'storage' },
  { id: 'hardware', label: 'Barcode & QR', countKey: 'hardware' },
  { id: 'biometric', label: 'Attendance & Biometric', countKey: 'biometric' },
] as const;

export type IntegrationCategoryId = (typeof INTEGRATION_CATEGORIES)[number]['id'];

export const INTEGRATION_STATUSES = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  TEST_MODE: 'test_mode',
  DEGRADED: 'degraded',
} as const;

export type IntegrationStatus = (typeof INTEGRATION_STATUSES)[keyof typeof INTEGRATION_STATUSES];

export const INTEGRATION_ENVIRONMENTS = {
  PRODUCTION: 'Production',
  SANDBOX: 'Sandbox',
} as const;

export type IntegrationEnvironment = (typeof INTEGRATION_ENVIRONMENTS)[keyof typeof INTEGRATION_ENVIRONMENTS];

export const WEBHOOK_EVENT_CATALOG = [
  'tenant.created',
  'tenant.suspended',
  'branch.created',
  'subscription.renewed',
  'subscription.expired',
  'payment.success',
  'payment.failed',
  'attendance.checkin',
  'attendance.biometric_sync',
  'invoice.generated',
  'invoice.overdue',
  'member.admitted',
  'member.expired',
] as const;

export type WebhookEventName = (typeof WEBHOOK_EVENT_CATALOG)[number];

export const API_KEY_STATUSES = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
  EXPIRING_SOON: 'expiring_soon',
} as const;

export type ApiKeyStatus = (typeof API_KEY_STATUSES)[keyof typeof API_KEY_STATUSES];

export const DEFAULT_RATE_LIMITS = {
  requestsPerMinute: 300,
  dailyQuota: 50000,
  burstLimit: 50,
  enforceIpAllowlist: true,
} as const;

export const INTEGRATION_TABS = [
  { id: 'gateways', label: 'Connected Providers', icon: 'Layers' },
  { id: 'webhooks', label: 'Webhooks & Retries', icon: 'Webhook' },
  { id: 'api-keys', label: 'API Keys & Rate Limits', icon: 'Key' },
  { id: 'logs', label: 'Integration Logs', icon: 'Activity' },
  { id: 'entitlements', label: 'Plan Entitlements', icon: 'ShieldCheck' },
] as const;

export type IntegrationTabId = 'gateways' | 'webhooks' | 'api-keys' | 'logs' | 'entitlements';
