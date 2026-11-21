// components/SuperadminIntegrationsOverviewWebhooksPanel.tsx
// RESPONSIBILITY: Manage webhook endpoints, subscribed event triggers, and failed delivery retries.
// DATA FLOW: Webhooks & Retries arrays -> SuperadminIntegrationsOverviewWebhooksPanel -> retry triggers.
'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Globe,
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
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Webhook size={16} className="text-purple-400" />
              Registered Webhook Endpoints
            </h2>
            <p className="text-xs text-muted-foreground">
              Dispatches signed HMAC-SHA256 HTTP POST callbacks on platform lifecycle events
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary hover:opacity-90 cursor-pointer transition-opacity min-w-36 justify-center shadow-xs"
          >
            <Plus size={14} /> Add Webhook Endpoint
          </button>
        </div>

        <div className="space-y-3">
          {webhooks.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">
              No webhook endpoints registered yet.
            </p>
          ) : (
            webhooks.map((wh) => (
              <div
                key={wh.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 text-xs"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-purple-400 font-semibold text-xs tracking-tight break-all">
                      {wh.url}
                    </span>
                    <span className="rounded-full bg-success-bg px-2 py-0.5 text-[10px] font-semibold text-success-text flex items-center gap-1">
                      <CheckCircle2 size={10} /> Active
                    </span>
                    <span className="text-[11px] text-muted-foreground">Rate: {wh.successRate}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{wh.description}</p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {wh.events.map((ev) => (
                      <span
                        key={ev}
                        className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-foreground font-mono"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono pt-1">
                    <span>Signing Secret: {wh.secretMasked}</span>
                    <button
                      type="button"
                      onClick={() => handleCopySecret(wh.secretMasked, wh.id)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="Copy Secret"
                    >
                      <Copy size={11} />
                    </button>
                    {copiedSecretId === wh.id && (
                      <span className="text-success-text font-sans">Copied!</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => onTestPingWebhook(wh.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
                  >
                    <Send size={11} /> Test Ping
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(wh)}
                    className="inline-flex items-center gap-1 rounded-lg border border-danger/30 text-danger-text px-2.5 py-1 text-[11px] font-medium hover:bg-danger/10 cursor-pointer transition-colors"
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
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <RefreshCw size={16} className="text-warning-text" />
              Failed Webhook Retries & Dead-Letter Queue
            </h2>
            <p className="text-xs text-muted-foreground">
              Automatic exponential backoff with manual replay controls for failed dispatch events
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-warning-bg text-warning-text font-semibold">
            {retries.length} Pending In Queue
          </span>
        </div>

        <div className="space-y-3">
          {retries.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground space-y-1">
              <CheckCircle2 size={24} className="mx-auto text-success-text" />
              <p>All webhook events delivered successfully. No failed retries in queue.</p>
            </div>
          ) : (
            retries.map((r) => {
              const isRetrying = isRetryingDeliveryId === r.id;
              return (
                <div
                  key={r.id}
                  className="rounded-xl border border-warning/30 bg-warning/5 p-4 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-md bg-warning-bg px-2 py-0.5 text-[10px] font-bold text-warning-text">
                        HTTP {r.statusCode}
                      </span>
                      <span className="font-mono font-semibold text-foreground text-xs">
                        {r.eventName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Attempts: {r.attemptsCount}/{r.maxAttempts}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRetryDelivery(r.id)}
                      disabled={isRetrying}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-warning-bg text-warning-text px-3 py-1 font-semibold text-xs hover:opacity-90 cursor-pointer min-w-32 justify-center shadow-xs transition-opacity"
                    >
                      {isRetrying ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <RefreshCw size={12} />
                      )}
                      <span>Retry Delivery Now</span>
                    </button>
                  </div>

                  <p className="text-muted-foreground font-mono text-[11px] truncate">
                    Target: {r.targetUrl}
                  </p>
                  <p className="text-[11px] text-danger-text">{r.errorMessage}</p>
                  <div className="rounded-lg bg-card p-2 font-mono text-[10px] text-muted-foreground truncate">
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
