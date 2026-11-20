// components/SuperadminIntegrationsOverviewMain.tsx
// RESPONSIBILITY: Primary orchestrator assembling top header, KPIs, secondary tabs, panels, and modals.
// DATA FLOW: Hooks -> SuperadminIntegrationsOverviewMain -> Child panels & modals. No direct fetch calls.
'use client';

import {
  Activity,
  Cable,
  CheckCircle2,
  Gauge,
  Key,
  Layers,
  RefreshCw,
  ShieldCheck,
  Webhook,
} from 'lucide-react';
import React, { useState } from 'react';
import { useSuperadminIntegrationsOverview } from '../hooks/useSuperadminIntegrationsOverview';
import { useSuperadminIntegrationsOverviewConfirm } from '../hooks/useSuperadminIntegrationsOverviewConfirm';
import { useSuperadminIntegrationsOverviewMutations } from '../hooks/useSuperadminIntegrationsOverviewMutations';
import { useSuperadminIntegrationsOverviewStore } from '../state/useSuperadminIntegrationsOverviewStore';
import { SuperadminIntegrationsOverviewApiKeysPanel } from './SuperadminIntegrationsOverviewApiKeysPanel';
import { SuperadminIntegrationsOverviewEntitlementsPanel } from './SuperadminIntegrationsOverviewEntitlementsPanel';
import { SuperadminIntegrationsOverviewErrorFallback } from './SuperadminIntegrationsOverviewErrorFallback';
import { SuperadminIntegrationsOverviewGatewayConfigModal } from './SuperadminIntegrationsOverviewGatewayConfigModal';
import { SuperadminIntegrationsOverviewGatewayGrid } from './SuperadminIntegrationsOverviewGatewayGrid';
import { SuperadminIntegrationsOverviewListSkeleton } from './SuperadminIntegrationsOverviewListSkeleton';
import { SuperadminIntegrationsOverviewLogsPanel } from './SuperadminIntegrationsOverviewLogsPanel';
import { SuperadminIntegrationsOverviewWebhooksPanel } from './SuperadminIntegrationsOverviewWebhooksPanel';

export const SuperadminIntegrationsOverviewMain: React.FC = () => {
  const {
    activeTab,
    selectedCategory,
    searchQuery,
    handleTabSelect,
    setSelectedCategory,
    setSearchQuery,
    resetFilters,
    openConfigModal,
    closeConfigModal,
    setNewlyCreatedKeyResult,
    setSelectedLogItem,
    summary,
    gateways,
    webhooks,
    webhookRetries,
    apiKeys,
    rateLimits,
    logs,
    entitlements,
    isPending,
    isError,
    refetchAll,
  } = useSuperadminIntegrationsOverview();

  const {
    selectedGateway,
    isConfigModalOpen,
    newlyCreatedKeyResult,
    selectedLogItem,
  } = useSuperadminIntegrationsOverviewStore();

  const confirmAction = useSuperadminIntegrationsOverviewConfirm();
  const mutations = useSuperadminIntegrationsOverviewMutations();

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const handleToggleGateway = (id: string, currentEnabled: boolean) => {
    setTogglingId(id);
    mutations.toggleGateway.mutate(
      { id, enabled: !currentEnabled },
      { onSettled: () => setTogglingId(null) }
    );
  };

  const handleTestPingGateway = (id: string) => {
    setPingingId(id);
    mutations.testPing.mutate(id, { onSettled: () => setPingingId(null) });
  };

  if (isPending && !summary) {
    return <SuperadminIntegrationsOverviewListSkeleton />;
  }

  if (isError) {
    return <SuperadminIntegrationsOverviewErrorFallback reset={refetchAll} />;
  }

  return (
    <div className="space-y-6" data-testid="superadmin-integrations-main">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-purple-bg text-purple-text shadow-xs">
            <Cable size={24} strokeWidth={2} />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              13. Integration & API Management
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-bg text-purple-text font-semibold">
                SaaS Enterprise Hub
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control payment gateways, SMS, WhatsApp, Email, Cloud Storage, Barcode/QR, Biometrics, Webhooks & API keys.
            </p>
          </div>
        </div>

        {/* Secondary Navigation Top Tab Bar */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border overflow-x-auto" role="tablist">
          {[
            { id: 'gateways', label: 'Providers', icon: Layers },
            { id: 'webhooks', label: 'Webhooks', icon: Webhook, badge: summary?.failedWebhooksCount ? `${summary.failedWebhooksCount}` : undefined },
            { id: 'api-keys', label: 'API Keys', icon: Key },
            { id: 'logs', label: 'Live Logs', icon: Activity },
            { id: 'entitlements', label: 'Plan Access', icon: ShieldCheck },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabSelect(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-danger text-on-danger text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── KPI Summary Statistics Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground block">Total Providers</span>
          <div className="text-lg font-bold text-foreground">{summary?.totalGateways ?? 12}</div>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground block">Active Live</span>
          <div className="text-lg font-bold text-success-text flex items-center gap-1">
            <CheckCircle2 size={16} /> {summary?.activeGateways ?? 10}
          </div>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground block">Failed Retries Queue</span>
          <div className="text-lg font-bold text-warning-text flex items-center gap-1">
            <RefreshCw size={16} /> {summary?.failedWebhooksCount ?? 2}
          </div>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground block">Active API Keys</span>
          <div className="text-lg font-bold text-foreground">{summary?.activeApiKeysCount ?? 4}</div>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-muted-foreground block">API Calls Today</span>
          <div className="text-lg font-bold text-purple-400">
            {(summary?.todayApiRequestsCount ?? 148290).toLocaleString()}
          </div>
        </div>
      </div>

      {/* ── Active Tab Panel Views ── */}
      {activeTab === 'gateways' && (
        <SuperadminIntegrationsOverviewGatewayGrid
          gateways={gateways}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onSelectCategory={setSelectedCategory}
          onSearchChange={setSearchQuery}
          onResetFilters={resetFilters}
          onConfigure={openConfigModal}
          onToggle={handleToggleGateway}
          onTestPing={handleTestPingGateway}
          togglingGatewayId={togglingId}
          pingingGatewayId={pingingId}
        />
      )}

      {activeTab === 'webhooks' && (
        <SuperadminIntegrationsOverviewWebhooksPanel
          webhooks={webhooks}
          retries={webhookRetries}
          onCreateWebhook={(p) => mutations.createWebhook.mutate(p)}
          onDeleteWebhook={(id) => mutations.deleteWebhook.mutate(id)}
          onTestPingWebhook={(id) => mutations.testPing.mutate(id)}
          onRetryDelivery={(id) => mutations.retryWebhook.mutate(id)}
          onConfirmDelete={(msg) => confirmAction(msg, { destructive: true, title: 'Delete Webhook' })}
          isCreating={mutations.createWebhook.isPending}
          isRetryingDeliveryId={mutations.retryWebhook.isPending ? 'pending' : null}
        />
      )}

      {activeTab === 'api-keys' && (
        <SuperadminIntegrationsOverviewApiKeysPanel
          apiKeys={apiKeys}
          rateLimits={rateLimits}
          newKeyResult={newlyCreatedKeyResult}
          onClearNewKeyResult={() => setNewlyCreatedKeyResult(null)}
          onCreateKey={(p) => mutations.generateKey.mutate(p, { onSuccess: (res) => setNewlyCreatedKeyResult(res.data) })}
          onRotateKey={(id) => mutations.rotateKey.mutate(id, { onSuccess: (res) => setNewlyCreatedKeyResult(res.data) })}
          onRevokeKey={(id) => mutations.revokeKey.mutate(id)}
          onSaveRateLimits={(p) => mutations.saveRateLimits.mutate(p)}
          onConfirmRevoke={(msg) => confirmAction(msg, { destructive: true, title: 'Revoke API Key' })}
          isGenerating={mutations.generateKey.isPending}
          isSavingLimits={mutations.saveRateLimits.isPending}
        />
      )}

      {activeTab === 'logs' && (
        <SuperadminIntegrationsOverviewLogsPanel
          logs={logs}
          selectedLog={selectedLogItem}
          onSelectLog={setSelectedLogItem}
        />
      )}

      {activeTab === 'entitlements' && (
        <SuperadminIntegrationsOverviewEntitlementsPanel
          entitlements={entitlements}
          onToggleEntitlement={(planId, providerKey, enabled) =>
            mutations.toggleEntitlement.mutate({ planId, providerKey, enabled })
          }
          isUpdating={mutations.toggleEntitlement.isPending}
        />
      )}

      {/* ── Modals ── */}
      <SuperadminIntegrationsOverviewGatewayConfigModal
        gateway={selectedGateway}
        isOpen={isConfigModalOpen}
        onClose={closeConfigModal}
        onSave={(id, payload) => {
          mutations.updateGateway.mutate({ id, payload }, { onSuccess: closeConfigModal });
        }}
        onTestPing={(id) => mutations.testPing.mutate(id)}
        isSaving={mutations.updateGateway.isPending}
        isPinging={mutations.testPing.isPending}
      />
    </div>
  );
};
