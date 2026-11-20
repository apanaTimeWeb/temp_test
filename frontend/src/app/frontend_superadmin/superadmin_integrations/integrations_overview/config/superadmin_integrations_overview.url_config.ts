// config/superadmin_integrations_overview.url_config.ts
// Owned by: superadmin/superadmin_integrations/integrations_overview autonomous sub-module
// API endpoint exports MUST NOT be imported outside this feature module.
// Route exports may be imported only by the owning role-level navigation layer.

// ─── Internal Navigation Routes ────────────────────────────────────────────
export const SUPERADMIN_INTEGRATIONS_OVERVIEW_ROUTES = {
  /** Root integration hub screen */
  root: '/superadmin/superadmin_integrations/integrations_overview' as const,
  /** Tab-specific deep link helpers */
  tab: (tabName: string) => `/superadmin/superadmin_integrations/integrations_overview?tab=${encodeURIComponent(tabName)}` as const,
} as const;

// ─── External API Endpoints ─────────────────────────────────────────────────
export const SUPERADMIN_INTEGRATIONS_OVERVIEW_API = {
  /** GET: Integration hub stats & summary */
  summary: '/api/v1/superadmin/integrations/summary' as const,
  /** GET: All integration gateway providers list */
  gatewaysList: '/api/v1/superadmin/integrations/gateways' as const,
  /** GET: Single gateway detail */
  gatewayDetail: (id: string) => `/api/v1/superadmin/integrations/gateways/${id}` as const,
  /** PATCH: Update gateway configuration / credentials */
  gatewayUpdate: (id: string) => `/api/v1/superadmin/integrations/gateways/${id}` as const,
  /** POST: Test gateway live connection ping */
  gatewayTestPing: (id: string) => `/api/v1/superadmin/integrations/gateways/${id}/test` as const,
  /** PATCH: Toggle gateway active state */
  gatewayToggle: (id: string) => `/api/v1/superadmin/integrations/gateways/${id}/toggle` as const,

  /** GET: Webhook endpoints list */
  webhooksList: '/api/v1/superadmin/integrations/webhooks' as const,
  /** POST: Register new webhook endpoint */
  webhookCreate: '/api/v1/superadmin/integrations/webhooks' as const,
  /** PATCH: Update webhook endpoint */
  webhookUpdate: (id: string) => `/api/v1/superadmin/integrations/webhooks/${id}` as const,
  /** DELETE: Delete webhook endpoint */
  webhookDelete: (id: string) => `/api/v1/superadmin/integrations/webhooks/${id}` as const,
  /** POST: Send test ping to webhook endpoint */
  webhookTestPing: (id: string) => `/api/v1/superadmin/integrations/webhooks/${id}/ping` as const,
  /** GET: Failed webhook deliveries queue */
  webhookRetriesList: '/api/v1/superadmin/integrations/webhooks/retries' as const,
  /** POST: Retry failed webhook delivery */
  webhookRetryTrigger: (deliveryId: string) => `/api/v1/superadmin/integrations/webhooks/retries/${deliveryId}/retry` as const,

  /** GET: API Keys list */
  apiKeysList: '/api/v1/superadmin/integrations/api-keys' as const,
  /** POST: Generate new API key (returns plain-text key once) */
  apiKeyCreate: '/api/v1/superadmin/integrations/api-keys' as const,
  /** POST: Rotate existing API key */
  apiKeyRotate: (keyId: string) => `/api/v1/superadmin/integrations/api-keys/${keyId}/rotate` as const,
  /** DELETE: Revoke API key */
  apiKeyRevoke: (keyId: string) => `/api/v1/superadmin/integrations/api-keys/${keyId}` as const,

  /** GET: API Rate limits & IP Allowlist */
  rateLimitsGet: '/api/v1/superadmin/integrations/rate-limits' as const,
  /** PUT: Update rate limit quotas & IP allowlist */
  rateLimitsUpdate: '/api/v1/superadmin/integrations/rate-limits' as const,

  /** GET: Integration event logs */
  logsList: '/api/v1/superadmin/integrations/logs' as const,
  /** GET: Single integration log detail */
  logDetail: (logId: string) => `/api/v1/superadmin/integrations/logs/${logId}` as const,

  /** GET: Integration plan & account entitlements */
  entitlementsList: '/api/v1/superadmin/integrations/entitlements' as const,
  /** PATCH: Update entitlement toggle per plan or account */
  entitlementUpdate: '/api/v1/superadmin/integrations/entitlements' as const,
} as const;
