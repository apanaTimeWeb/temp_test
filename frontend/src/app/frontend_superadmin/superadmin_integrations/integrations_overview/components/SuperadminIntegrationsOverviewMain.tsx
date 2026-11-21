// components/SuperadminIntegrationsOverviewMain.tsx
// RESPONSIBILITY: Primary orchestrator assembling top header, KPIs, secondary tabs, panels, and modals.
// DATA FLOW: Hooks -> SuperadminIntegrationsOverviewMain -> Child panels & modals. No direct fetch calls.
'use client';

import {
  Activity,
  Cable,
  CheckCircle2,
  Key,
  Layers,
  RefreshCw,
  ShieldCheck,
  Terminal,
  Webhook,
} from 'lucide-react';
import React, { useState } from 'react';
import { useSuperadminIntegrationsOverview } from '../hooks/useSuperadminIntegrationsOverview';
import { useSuperadminIntegrationsOverviewConfirm } from '../hooks/useSuperadminIntegrationsOverviewConfirm';
import { useSuperadminIntegrationsOverviewMutations } from '../hooks/useSuperadminIntegrationsOverviewMutations';
import { useSuperadminIntegrationsOverviewStore } from '../state/useSuperadminIntegrationsOverviewStore';
import { SuperadminIntegrationsOverviewApiGuardSimulatorModal } from './SuperadminIntegrationsOverviewApiGuardSimulatorModal';
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
  const [isApiGuardOpen, setIsApiGuardOpen] = useState(false);

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
      {/* ── Hero Header: Cyber-Luxury Dark Theme ── */}
      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#180a2b]/90 via-[#0a0d24] to-[#060810] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/30 shadow-inner shrink-0">
              <Cable size={26} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                  13. Integration & API Management
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/15 text-purple-300 font-semibold shadow-xs">
                  SaaS Enterprise Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Control payment gateways, SMS, WhatsApp, Email, Cloud Storage, Barcode/QR, Biometrics, Webhooks & API keys.
              </p>
            </div>
          </div>

          {/* Secondary Navigation Top Tab Bar */}
          <div
            className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-indigo-500/25 backdrop-blur-md shadow-lg overflow-x-auto shrink-0"
            role="tablist"
          >
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsApiGuardOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/35 text-teal-300 transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95"
            >
              <Terminal size={14} />
              <span>API Guard Probe</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Summary Statistics Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/90 via-[#090d24]/90 to-[#050714]/90 p-4 space-y-1 shadow-lg backdrop-blur-md relative overflow-hidden">
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-indigo-500/10 blur-xl" />
          <span className="text-[11px] font-medium text-slate-400 block">Total Providers</span>
          <div className="text-xl font-bold text-slate-100">{summary?.totalGateways ?? 11}</div>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/90 via-[#090d24]/90 to-[#050714]/90 p-4 space-y-1 shadow-lg backdrop-blur-md relative overflow-hidden">
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-500/10 blur-xl" />
          <span className="text-[11px] font-medium text-slate-400 block">Active Live</span>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 size={16} /> {summary?.activeGateways ?? 9}
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/90 via-[#090d24]/90 to-[#050714]/90 p-4 space-y-1 shadow-lg backdrop-blur-md relative overflow-hidden">
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-amber-500/10 blur-xl" />
          <span className="text-[11px] font-medium text-slate-400 block">Failed Retries Queue</span>
          <div className="text-xl font-bold text-amber-400 flex items-center gap-1.5">
            <RefreshCw size={16} /> {summary?.failedWebhooksCount ?? 2}
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/90 via-[#090d24]/90 to-[#050714]/90 p-4 space-y-1 shadow-lg backdrop-blur-md relative overflow-hidden">
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-purple-500/10 blur-xl" />
          <span className="text-[11px] font-medium text-slate-400 block">Active API Keys</span>
          <div className="text-xl font-bold text-purple-300">{summary?.activeApiKeysCount ?? 2}</div>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/90 via-[#090d24]/90 to-[#050714]/90 p-4 space-y-1 shadow-lg backdrop-blur-md relative overflow-hidden col-span-2 sm:col-span-1">
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-cyan-500/10 blur-xl" />
          <span className="text-[11px] font-medium text-slate-400 block">API Calls Today</span>
          <div className="text-xl font-bold text-cyan-400">
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

      <SuperadminIntegrationsOverviewApiGuardSimulatorModal
        isOpen={isApiGuardOpen}
        onClose={() => setIsApiGuardOpen(false)}
      />
    </div>
  );
};
