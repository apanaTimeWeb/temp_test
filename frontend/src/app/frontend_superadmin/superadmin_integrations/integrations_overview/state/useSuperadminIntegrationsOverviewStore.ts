// state/useSuperadminIntegrationsOverviewStore.ts
// Module-scoped Zustand store for UI-only client transient state.
// DATA FLOW: UI interaction -> useSuperadminIntegrationsOverviewStore -> component render.
// NOTE: Server data is owned strictly by TanStack Query, NOT Zustand.
import { create } from 'zustand';
import type { IntegrationTabId } from '../constants/superadmin_integrations_overview.constants';
import type {
  ApiKeyCreatedResult,
  IntegrationGatewayItem,
  IntegrationLogItem,
} from '../types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewState {
  activeTab: IntegrationTabId;
  selectedCategory: string;
  searchQuery: string;
  selectedGateway: IntegrationGatewayItem | null;
  isConfigModalOpen: boolean;
  isWebhookModalOpen: boolean;
  isApiKeyModalOpen: boolean;
  newlyCreatedKeyResult: ApiKeyCreatedResult | null;
  selectedLogItem: IntegrationLogItem | null;
  copiedId: string | null;

  // Actions
  setActiveTab: (tab: IntegrationTabId) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  openConfigModal: (gw: IntegrationGatewayItem) => void;
  closeConfigModal: () => void;
  openWebhookModal: () => void;
  closeWebhookModal: () => void;
  openApiKeyModal: () => void;
  closeApiKeyModal: () => void;
  setNewlyCreatedKeyResult: (result: ApiKeyCreatedResult | null) => void;
  setSelectedLogItem: (log: IntegrationLogItem | null) => void;
  setCopiedId: (id: string | null) => void;
  resetFilters: () => void;
}

export const useSuperadminIntegrationsOverviewStore = create<SuperadminIntegrationsOverviewState>((set) => ({
  activeTab: 'gateways',
  selectedCategory: 'all',
  searchQuery: '',
  selectedGateway: null,
  isConfigModalOpen: false,
  isWebhookModalOpen: false,
  isApiKeyModalOpen: false,
  newlyCreatedKeyResult: null,
  selectedLogItem: null,
  copiedId: null,

  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  openConfigModal: (selectedGateway) => set({ selectedGateway, isConfigModalOpen: true }),
  closeConfigModal: () => set({ selectedGateway: null, isConfigModalOpen: false }),
  openWebhookModal: () => set({ isWebhookModalOpen: true }),
  closeWebhookModal: () => set({ isWebhookModalOpen: false }),
  openApiKeyModal: () => set({ isApiKeyModalOpen: true }),
  closeApiKeyModal: () => set({ isApiKeyModalOpen: false }),
  setNewlyCreatedKeyResult: (newlyCreatedKeyResult) => set({ newlyCreatedKeyResult }),
  setSelectedLogItem: (selectedLogItem) => set({ selectedLogItem }),
  setCopiedId: (copiedId) => set({ copiedId }),
  resetFilters: () => set({ selectedCategory: 'all', searchQuery: '' }),
}));
