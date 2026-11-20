// api/superadmin_integrations_overview.api.ts
// Feature-scoped API client with typed ApiResponse<T> envelope and idempotency keys.
import { apiFetch, type ApiResponse } from '@/lib/api';
import { SUPERADMIN_INTEGRATIONS_OVERVIEW_API } from '../config/superadmin_integrations_overview.url_config';
import type {
  ApiKeyCreatePayload,
  ApiKeyCreatedResult,
  ApiKeyItem,
  GatewayUpdatePayload,
  IntegrationGatewayItem,
  IntegrationLogItem,
  IntegrationSummaryStats,
  PlanEntitlementItem,
  RateLimitPolicy,
  WebhookCreatePayload,
  WebhookEndpointItem,
  WebhookRetryItem,
} from '../types/superadmin_integrations_overview.types';

export async function fetchIntegrationSummary(): Promise<ApiResponse<IntegrationSummaryStats>> {
  return apiFetch<IntegrationSummaryStats>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.summary);
}

export async function fetchIntegrationGateways(): Promise<ApiResponse<IntegrationGatewayItem[]>> {
  return apiFetch<IntegrationGatewayItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewaysList);
}

export async function updateIntegrationGateway(
  id: string,
  payload: GatewayUpdatePayload,
  idempotencyKey: string
): Promise<ApiResponse<IntegrationGatewayItem>> {
  return apiFetch<IntegrationGatewayItem>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewayUpdate(id), {
    method: 'PATCH',
    body: JSON.stringify(payload),
    idempotencyKey,
  });
}

export async function testIntegrationGatewayPing(
  id: string,
  idempotencyKey: string
): Promise<ApiResponse<{ status: string; latencyMs: number; message: string }>> {
  return apiFetch<{ status: string; latencyMs: number; message: string }>(
    SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewayTestPing(id),
    {
      method: 'POST',
      idempotencyKey,
    }
  );
}

export async function toggleIntegrationGateway(
  id: string,
  enabled: boolean,
  idempotencyKey: string
): Promise<ApiResponse<IntegrationGatewayItem>> {
  return apiFetch<IntegrationGatewayItem>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewayToggle(id), {
    method: 'PATCH',
    body: JSON.stringify({ isEnabled: enabled }),
    idempotencyKey,
  });
}

export async function fetchWebhookEndpoints(): Promise<ApiResponse<WebhookEndpointItem[]>> {
  return apiFetch<WebhookEndpointItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhooksList);
}

export async function createWebhookEndpoint(
  payload: WebhookCreatePayload,
  idempotencyKey: string
): Promise<ApiResponse<WebhookEndpointItem>> {
  return apiFetch<WebhookEndpointItem>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookCreate, {
    method: 'POST',
    body: JSON.stringify(payload),
    idempotencyKey,
  });
}

export async function deleteWebhookEndpoint(
  id: string,
  idempotencyKey: string
): Promise<ApiResponse<{ id: string }>> {
  return apiFetch<{ id: string }>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookDelete(id), {
    method: 'DELETE',
    idempotencyKey,
  });
}

export async function testWebhookPing(
  id: string,
  idempotencyKey: string
): Promise<ApiResponse<{ statusCode: number; responseSnippet: string }>> {
  return apiFetch<{ statusCode: number; responseSnippet: string }>(
    SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookTestPing(id),
    {
      method: 'POST',
      idempotencyKey,
    }
  );
}

export async function fetchWebhookRetries(): Promise<ApiResponse<WebhookRetryItem[]>> {
  return apiFetch<WebhookRetryItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookRetriesList);
}

export async function triggerWebhookRetry(
  deliveryId: string,
  idempotencyKey: string
): Promise<ApiResponse<{ deliveryId: string; status: string }>> {
  return apiFetch<{ deliveryId: string; status: string }>(
    SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookRetryTrigger(deliveryId),
    {
      method: 'POST',
      idempotencyKey,
    }
  );
}

export async function fetchApiKeys(): Promise<ApiResponse<ApiKeyItem[]>> {
  return apiFetch<ApiKeyItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeysList);
}

export async function createApiKey(
  payload: ApiKeyCreatePayload,
  idempotencyKey: string
): Promise<ApiResponse<ApiKeyCreatedResult>> {
  return apiFetch<ApiKeyCreatedResult>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeyCreate, {
    method: 'POST',
    body: JSON.stringify(payload),
    idempotencyKey,
  });
}

export async function rotateApiKey(
  keyId: string,
  idempotencyKey: string
): Promise<ApiResponse<ApiKeyCreatedResult>> {
  return apiFetch<ApiKeyCreatedResult>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeyRotate(keyId), {
    method: 'POST',
    idempotencyKey,
  });
}

export async function revokeApiKey(
  keyId: string,
  idempotencyKey: string
): Promise<ApiResponse<{ keyId: string; status: string }>> {
  return apiFetch<{ keyId: string; status: string }>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeyRevoke(keyId), {
    method: 'DELETE',
    idempotencyKey,
  });
}

export async function fetchRateLimits(): Promise<ApiResponse<RateLimitPolicy>> {
  return apiFetch<RateLimitPolicy>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.rateLimitsGet);
}

export async function updateRateLimits(
  payload: RateLimitPolicy,
  idempotencyKey: string
): Promise<ApiResponse<RateLimitPolicy>> {
  return apiFetch<RateLimitPolicy>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.rateLimitsUpdate, {
    method: 'PUT',
    body: JSON.stringify(payload),
    idempotencyKey,
  });
}

export async function fetchIntegrationLogs(): Promise<ApiResponse<IntegrationLogItem[]>> {
  return apiFetch<IntegrationLogItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.logsList);
}

export async function fetchPlanEntitlements(): Promise<ApiResponse<PlanEntitlementItem[]>> {
  return apiFetch<PlanEntitlementItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.entitlementsList);
}

export async function updatePlanEntitlement(
  planId: string,
  providerKey: string,
  enabled: boolean,
  idempotencyKey: string
): Promise<ApiResponse<PlanEntitlementItem>> {
  return apiFetch<PlanEntitlementItem>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.entitlementUpdate, {
    method: 'PATCH',
    body: JSON.stringify({ planId, providerKey, isAllowed: enabled }),
    idempotencyKey,
  });
}
