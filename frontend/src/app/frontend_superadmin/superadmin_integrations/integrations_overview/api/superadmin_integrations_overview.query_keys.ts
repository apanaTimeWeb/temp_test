// api/superadmin_integrations_overview.query_keys.ts
// Strict TanStack Query key factory for surgical cache invalidation.

export const SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS = {
  all: ['superadmin_integrations_overview'] as const,
  summary: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'summary'] as const,
  gateways: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'gateways'] as const,
  gatewayDetail: (id: string) => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.gateways(), id] as const,
  webhooks: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'webhooks'] as const,
  webhookRetries: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'webhook_retries'] as const,
  apiKeys: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'api_keys'] as const,
  rateLimits: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'rate_limits'] as const,
  logs: (filters?: Record<string, unknown>) => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'logs', filters ?? {}] as const,
  entitlements: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'entitlements'] as const,
};
