// hooks/useSuperadminIntegrationsQueries.ts
// Sub-hook isolating TanStack Query v5 queries for integrations overview.
'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchApiKeys,
  fetchIntegrationGateways,
  fetchIntegrationLogs,
  fetchIntegrationSummary,
  fetchPlanEntitlements,
  fetchRateLimits,
  fetchWebhookEndpoints,
  fetchWebhookRetries,
} from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/api/superadmin_integrations_overview.api';
import { SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/api/superadmin_integrations_overview.query_keys';

export function useSuperadminIntegrationsQueries() {
  const summaryQuery = useQuery({
    queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.summary(),
    queryFn: fetchIntegrationSummary,
    staleTime: 60000,
  });

  const gatewaysQuery = useQuery({
    queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.gateways(),
    queryFn: fetchIntegrationGateways,
    staleTime: 60000,
  });

  const webhooksQuery = useQuery({
    queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.webhooks(),
    queryFn: fetchWebhookEndpoints,
    staleTime: 60000,
  });

  const webhookRetriesQuery = useQuery({
    queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.webhookRetries(),
    queryFn: fetchWebhookRetries,
    staleTime: 30000,
  });

  const apiKeysQuery = useQuery({
    queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.apiKeys(),
    queryFn: fetchApiKeys,
    staleTime: 60000,
  });

  const rateLimitsQuery = useQuery({
    queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.rateLimits(),
    queryFn: fetchRateLimits,
    staleTime: 60000,
  });

  const logsQuery = useQuery({
    queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.logs(),
    queryFn: fetchIntegrationLogs,
    staleTime: 30000,
  });

  const entitlementsQuery = useQuery({
    queryKey: SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.entitlements(),
    queryFn: fetchPlanEntitlements,
    staleTime: 60000,
  });

  return {
    summary: summaryQuery.data?.data,
    rawGateways: gatewaysQuery.data?.data ?? [],
    webhooks: webhooksQuery.data?.data ?? [],
    webhookRetries: webhookRetriesQuery.data?.data ?? [],
    apiKeys: apiKeysQuery.data?.data ?? [],
    rateLimits: rateLimitsQuery.data?.data,
    logs: logsQuery.data?.data ?? [],
    entitlements: entitlementsQuery.data?.data ?? [],
    isPending: gatewaysQuery.isPending || summaryQuery.isPending,
    isError: gatewaysQuery.isError || summaryQuery.isError,
    refetchAll: () => {
      summaryQuery.refetch();
      gatewaysQuery.refetch();
    },
  };
}
