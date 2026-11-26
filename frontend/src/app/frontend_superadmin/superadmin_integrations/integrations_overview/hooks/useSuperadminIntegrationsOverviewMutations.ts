// hooks/useSuperadminIntegrationsOverviewMutations.ts
// Mutation hooks attaching idempotency keys, query invalidations, and deduplicated toasts.
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createIdempotencyKey } from '@/lib/api';
import {
  createApiKey,
  createWebhookEndpoint,
  deleteWebhookEndpoint,
  revokeApiKey,
  rotateApiKey,
  testIntegrationGatewayPing,
  testWebhookPing,
  toggleIntegrationGateway,
  triggerWebhookRetry,
  updateIntegrationGateway,
  updatePlanEntitlement,
  updateRateLimits,
} from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/api/superadmin_integrations_overview.api';
import { SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/api/superadmin_integrations_overview.query_keys';
import type {
  ApiKeyCreatePayload,
  GatewayUpdatePayload,
  RateLimitPolicy,
  WebhookCreatePayload,
} from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/types/superadmin_integrations_overview.types';

export function useSuperadminIntegrationsOverviewMutations() {
  const queryClient = useQueryClient();

  const toggleGateway = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      toggleIntegrationGateway(id, enabled, createIdempotencyKey()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.gateways() });
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.summary() });
      toast.success(res.message, { id: 'toggle-gw-success' });
    },
    onError: (err: Error) => toast.error(err.message, { id: 'toggle-gw-error' }),
  });

  const updateGateway = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: GatewayUpdatePayload }) =>
      updateIntegrationGateway(id, payload, createIdempotencyKey()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.gateways() });
      toast.success(res.message, { id: 'update-gw-success' });
    },
    onError: (err: Error) => toast.error(err.message, { id: 'update-gw-error' }),
  });

  const testPing = useMutation({
    mutationFn: (id: string) => testIntegrationGatewayPing(id, createIdempotencyKey()),
    onSuccess: (res) => toast.success(res.message, { id: 'test-ping-success' }),
    onError: (err: Error) => toast.error(err.message, { id: 'test-ping-error' }),
  });

  const createWebhook = useMutation({
    mutationFn: (payload: WebhookCreatePayload) => createWebhookEndpoint(payload, createIdempotencyKey()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.webhooks() });
      toast.success(res.message, { id: 'create-wh-success' });
    },
    onError: (err: Error) => toast.error(err.message, { id: 'create-wh-error' }),
  });

  const deleteWebhook = useMutation({
    mutationFn: (id: string) => deleteWebhookEndpoint(id, createIdempotencyKey()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.webhooks() });
      toast.success(res.message, { id: 'delete-wh-success' });
    },
    onError: (err: Error) => toast.error(err.message, { id: 'delete-wh-error' }),
  });

  const retryWebhook = useMutation({
    mutationFn: (deliveryId: string) => triggerWebhookRetry(deliveryId, createIdempotencyKey()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.webhookRetries() });
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.summary() });
      toast.success(res.message, { id: 'retry-wh-success' });
    },
    onError: (err: Error) => toast.error(err.message, { id: 'retry-wh-error' }),
  });

  const generateKey = useMutation({
    mutationFn: (payload: ApiKeyCreatePayload) => createApiKey(payload, createIdempotencyKey()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.apiKeys() });
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.summary() });
      toast.success(res.message, { id: 'create-key-success' });
    },
    onError: (err: Error) => toast.error(err.message, { id: 'create-key-error' }),
  });

  const rotateKey = useMutation({
    mutationFn: (keyId: string) => rotateApiKey(keyId, createIdempotencyKey()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.apiKeys() });
      toast.success(res.message, { id: 'rotate-key-success' });
    },
    onError: (err: Error) => toast.error(err.message, { id: 'rotate-key-error' }),
  });

  const revokeKey = useMutation({
    mutationFn: (keyId: string) => revokeApiKey(keyId, createIdempotencyKey()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.apiKeys() });
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.summary() });
      toast.success(res.message, { id: 'revoke-key-success' });
    },
    onError: (err: Error) => toast.error(err.message, { id: 'revoke-key-error' }),
  });

  const saveRateLimits = useMutation({
    mutationFn: (payload: RateLimitPolicy) => updateRateLimits(payload, createIdempotencyKey()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.rateLimits() });
      toast.success(res.message, { id: 'rate-limits-success' });
    },
    onError: (err: Error) => toast.error(err.message, { id: 'rate-limits-error' }),
  });

  const toggleEntitlement = useMutation({
    mutationFn: ({ planId, providerKey, enabled }: { planId: string; providerKey: string; enabled: boolean }) =>
      updatePlanEntitlement(planId, providerKey, enabled, createIdempotencyKey()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.entitlements() });
      toast.success(res.message, { id: 'entitlement-success' });
    },
    onError: (err: Error) => toast.error(err.message, { id: 'entitlement-error' }),
  });

  return {
    toggleGateway,
    updateGateway,
    testPing,
    createWebhook,
    deleteWebhook,
    retryWebhook,
    generateKey,
    rotateKey,
    revokeKey,
    saveRateLimits,
    toggleEntitlement,
  };
}
