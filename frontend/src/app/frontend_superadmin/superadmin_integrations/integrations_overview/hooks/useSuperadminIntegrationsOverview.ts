// hooks/useSuperadminIntegrationsOverview.ts
// Custom hook orchestrating queries, URL tab synchronization, and search filtering.
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { IntegrationTabId } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/constants/superadmin_integrations_overview.constants';
import { useSuperadminIntegrationsOverviewStore } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/state/useSuperadminIntegrationsOverviewStore';
import { useSuperadminIntegrationsQueries } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/hooks/useSuperadminIntegrationsQueries';

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

  // TanStack Query v5 operations via sub-hook
  const queries = useSuperadminIntegrationsQueries();

  // Filtered gateways based on category and search
  const filteredGateways = useMemo(() => {
    const list = queries.rawGateways;
    return list.filter((gw) => {
      const matchesCategory = selectedCategory === 'all' || gw.category === selectedCategory;
      const matchesSearch =
        debouncedSearch.trim() === '' ||
        gw.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        gw.providerKey.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [queries.rawGateways, selectedCategory, debouncedSearch]);

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
    summary: queries.summary,
    gateways: filteredGateways,
    rawGateways: queries.rawGateways,
    webhooks: queries.webhooks,
    webhookRetries: queries.webhookRetries,
    apiKeys: queries.apiKeys,
    rateLimits: queries.rateLimits,
    logs: queries.logs,
    entitlements: queries.entitlements,
    // Loading / error states
    isPending: queries.isPending,
    isError: queries.isError,
    refetchAll: queries.refetchAll,
  };
}
