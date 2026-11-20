// hooks/useSuperadminIntegrationsOverview.ts
// Custom hook orchestrating queries, URL tab synchronization, and search filtering.
'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  fetchApiKeys,
  fetchIntegrationGateways,
  fetchIntegrationLogs,
  fetchIntegrationSummary,
  fetchPlanEntitlements,
  fetchRateLimits,
  fetchWebhookEndpoints,
  fetchWebhookRetries,
} from '../api/superadmin_integrations_overview.api';
import { SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS } from '../api/superadmin_integrations_overview.query_keys';
import type { IntegrationTabId } from '../constants/superadmin_integrations_overview.constants';
import { useSuperadminIntegrationsOverviewStore } from '../state/useSuperadminIntegrationsOverviewStore';

export function useSuperadminIntegrationsOverview() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    activeTab,
    selectedCategory,
    searchQuery,
    setActiveTab,
    setSelectedCategory,
    setSearchQuery,
    openConfigModal,
    closeConfigModal,
    openWebhookModal,
    closeWebhookModal,
    openApiKeyModal,
    closeApiKeyModal,
    setNewlyCreatedKeyResult,
    setSelectedLogItem,
    setCopiedId,
    resetFilters,
  } = useSuperadminIntegrationsOverviewStore();

  // Local debounced search query to satisfy Rule 15 and CLS/performance
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Sync tab from URL ?tab= on mount and change
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab) {
      if (['gateways', 'payment-gateways', 'messaging-apis'].includes(urlTab)) {
        setActiveTab('gateways');
        if (urlTab === 'payment-gateways') setSelectedCategory('payment');
        if (urlTab === 'messaging-apis') setSelectedCategory('messaging');
      } else if (['webhooks', 'api-keys', 'logs', 'entitlements'].includes(urlTab)) {
        setActiveTab(urlTab as IntegrationTabId);
      }
    }
  }, [searchParams, setActiveTab, setSelectedCategory]);

  const handleTabSelect = (tab: IntegrationTabId) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Queries using TanStack Query v5
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

  // Filtered gateways based on category and search
  const filteredGateways = useMemo(() => {
    const list = gatewaysQuery.data?.data ?? [];
    return list.filter((gw) => {
      const matchesCategory = selectedCategory === 'all' || gw.category === selectedCategory;
      const matchesSearch =
        debouncedSearch.trim() === '' ||
        gw.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        gw.providerKey.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [gatewaysQuery.data?.data, selectedCategory, debouncedSearch]);

  return {
    activeTab,
    selectedCategory,
    searchQuery,
    debouncedSearch,
    handleTabSelect,
    setSelectedCategory,
    setSearchQuery,
    resetFilters,
    openConfigModal,
    closeConfigModal,
    openWebhookModal,
    closeWebhookModal,
    openApiKeyModal,
    closeApiKeyModal,
    setNewlyCreatedKeyResult,
    setSelectedLogItem,
    setCopiedId,
    // Data
    summary: summaryQuery.data?.data,
    gateways: filteredGateways,
    rawGateways: gatewaysQuery.data?.data ?? [],
    webhooks: webhooksQuery.data?.data ?? [],
    webhookRetries: webhookRetriesQuery.data?.data ?? [],
    apiKeys: apiKeysQuery.data?.data ?? [],
    rateLimits: rateLimitsQuery.data?.data,
    logs: logsQuery.data?.data ?? [],
    entitlements: entitlementsQuery.data?.data ?? [],
    // Loading / error states
    isPending: gatewaysQuery.isPending || summaryQuery.isPending,
    isError: gatewaysQuery.isError || summaryQuery.isError,
    refetchAll: () => {
      summaryQuery.refetch();
      gatewaysQuery.refetch();
    },
  };
}
