// components/SuperadminIntegrationsOverviewWebhooksPanel.tsx
// RESPONSIBILITY: Manage webhook endpoints, subscribed event triggers, and failed delivery retries.
// DATA FLOW: Webhooks & Retries arrays -> SuperadminIntegrationsOverviewWebhooksPanel -> retry triggers.
'use client';

import {
  CheckCircle2,
  Copy,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  Webhook,
} from 'lucide-react';
import React, { useState } from 'react';
import type {
  WebhookCreatePayload,
  WebhookEndpointItem,
  WebhookRetryItem,
} from '../types/superadmin_integrations_overview.types';
import { SuperadminIntegrationsOverviewWebhookCreateModal } from './SuperadminIntegrationsOverviewWebhookCreateModal';

interface SuperadminIntegrationsOverviewWebhooksPanelProps {
  webhooks: WebhookEndpointItem[];
  retries: WebhookRetryItem[];
  onCreateWebhook: (payload: WebhookCreatePayload) => void;
  onDeleteWebhook: (id: string) => void;
  onTestPingWebhook: (id: string) => void;
  onRetryDelivery: (deliveryId: string) => void;
  onConfirmDelete: (message: string) => Promise<boolean>;
  isCreating?: boolean;
  isRetryingDeliveryId?: string | null;
}

export const SuperadminIntegrationsOverviewWebhooksPanel: React.FC<
  SuperadminIntegrationsOverviewWebhooksPanelProps
> = ({
  webhooks,
  retries,
  onCreateWebhook,
  onDeleteWebhook,
  onTestPingWebhook,
  onRetryDelivery,
  onConfirmDelete,
  isCreating = false,
  isRetryingDeliveryId,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedSecretId, setCopiedSecretId] = useState<string | null>(null);

  const handleCopySecret = (secret: string, id: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedSecretId(id);
    setTimeout(() => setCopiedSecretId(null), 2000);
  };

  const handleDeleteClick = async (wh: WebhookEndpointItem) => {
    const ok = await onConfirmDelete(
      `Are you sure you want to permanently delete webhook endpoint "${wh.url}"? This action cannot be undone.`
    );
    if (ok) {
      onDeleteWebhook(wh.id);
    }
  };

  return (
    <div className="space-y-6" data-testid="superadmin-webhooks-panel">
      {/* ── Section 1: Active Webhook Endpoints ── */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 p-5 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Webhook size={16} className="text-purple-400" />
              Registered Webhook Endpoints
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dispatches signed HMAC-SHA256 HTTP POST callbacks on platform lifecycle events
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-3.5 py-1.5 text-xs font-semibold text-white cursor-pointer transition-opacity min-w-36 justify-center shadow-md shadow-indigo-500/25"
          >
            <Plus size={14} /> Add Webhook Endpoint
          </button>
        </div>

        <div className="space-y-3">
          {webhooks.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No webhook endpoints registered yet.
            </p>
          ) : (
            webhooks.map((wh) => (
              <div
                key={wh.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-indigo-500/20 bg-slate-950/70 p-4 text-xs shadow-inner"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-purple-300 font-semibold text-xs tracking-tight break-all">
                      {wh.url}
                    </span>
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Active
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Rate: {wh.successRate}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{wh.description}</p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {wh.events.map((ev) => (
                      <span
                        key={ev}
                        className="rounded-md bg-slate-900 border border-indigo-500/20 px-2 py-0.5 text-[10px] text-slate-300 font-mono"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                    <span>Signing Secret: {wh.secretMasked}</span>
                    <button
                      type="button"
                      onClick={() => handleCopySecret(wh.secretMasked, wh.id)}
                      className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors p-0.5"
                      title="Copy Secret"
                    >
                      <Copy size={11} />
                    </button>
                    {copiedSecretId === wh.id && (
                      <span className="text-emerald-400 font-sans font-semibold">Copied!</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => onTestPingWebhook(wh.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/20 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-700/80 hover:text-white cursor-pointer transition-colors shadow-xs"
                  >
                    <Send size={11} /> Test Ping
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(wh)}
                    className="inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 px-2.5 py-1 text-[11px] font-medium hover:bg-rose-500/20 cursor-pointer transition-colors shadow-xs"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Section 2: Failed Webhook Retries Queue ── */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#1c1204]/90 via-[#0e0a18] to-[#050714] p-5 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-500/20">
          <div>
            <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <RefreshCw size={16} className="text-amber-400" />
              Failed Webhook Retries & Dead-Letter Queue
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatic exponential backoff with manual replay controls for failed dispatch events
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-300 font-semibold shrink-0">
            {retries.length} Pending In Queue
          </span>
        </div>

        <div className="space-y-3">
          {retries.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 space-y-1">
              <CheckCircle2 size={24} className="mx-auto text-emerald-400" />
              <p>All webhook events delivered successfully. No failed retries in queue.</p>
            </div>
          ) : (
            retries.map((r) => {
              const isRetrying = isRetryingDeliveryId === r.id;
              return (
                <div
                  key={r.id}
                  className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-4 space-y-2 text-xs shadow-inner"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-md border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        HTTP {r.statusCode}
                      </span>
                      <span className="font-mono font-semibold text-slate-200 text-xs">
                        {r.eventName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Attempts: {r.attemptsCount}/{r.maxAttempts}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRetryDelivery(r.id)}
                      disabled={isRetrying}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 text-amber-300 px-3 py-1 font-semibold text-xs hover:bg-amber-500/30 cursor-pointer min-w-32 justify-center shadow-xs transition-opacity disabled:opacity-50"
                    >
                      {isRetrying ? (
                        <Loader2 size={12} className="animate-spin text-amber-400" />
                      ) : (
                        <RefreshCw size={12} />
                      )}
                      <span>Retry Delivery Now</span>
                    </button>
                  </div>

                  <p className="text-slate-400 font-mono text-[11px] truncate">
                    Target: {r.targetUrl}
                  </p>
                  <p className="text-[11px] text-rose-400">{r.errorMessage}</p>
                  <div className="rounded-lg border border-indigo-500/20 bg-slate-950/80 p-2.5 font-mono text-[10px] text-slate-400 truncate shadow-inner">
                    Payload: {r.payloadSnippet}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Add Webhook Modal ── */}
      <SuperadminIntegrationsOverviewWebhookCreateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreateWebhook={onCreateWebhook}
        isCreating={isCreating}
      />
    </div>
  );
};
