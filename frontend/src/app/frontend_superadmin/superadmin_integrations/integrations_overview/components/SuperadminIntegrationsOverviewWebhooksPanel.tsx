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
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { WEBHOOK_EVENT_CATALOG, type WebhookEventName } from '../constants/superadmin_integrations_overview.constants';
import type {
  WebhookCreatePayload,
  WebhookEndpointItem,
  WebhookRetryItem,
} from '../types/superadmin_integrations_overview.types';

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
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventName[]>(['tenant.created', 'payment.success']);
  const [copiedSecretId, setCopiedSecretId] = useState<string | null>(null);

  const handleCopySecret = (secret: string, id: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedSecretId(id);
    setTimeout(() => setCopiedSecretId(null), 2000);
  };

  const handleToggleEvent = (ev: WebhookEventName) => {
    setSelectedEvents((prev) =>
      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newDesc.trim() || selectedEvents.length === 0) return;
    onCreateWebhook({
      url: newUrl.trim(),
      description: newDesc.trim(),
      events: selectedEvents,
      isActive: true,
    });
    setNewUrl('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = async (wh: WebhookEndpointItem) => {
    const ok = await onConfirmDelete(`Are you sure you want to permanently delete webhook endpoint "${wh.url}"? This action cannot be undone.`);
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
            <p className="text-xs text-muted-foreground">Dispatches signed HMAC-SHA256 HTTP POST callbacks on platform lifecycle events</p>
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
            <p className="text-xs text-muted-foreground py-4 text-center">No webhook endpoints registered yet.</p>
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
                      <span key={ev} className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-foreground font-mono">
                        {ev}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono pt-1">
                    <span>Signing Secret: {wh.secretMasked}</span>
                    <button
                      type="button"
                      onClick={() => handleCopySecret(wh.secretMasked, wh.id)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Copy Secret"
                    >
                      <Copy size={11} />
                    </button>
                    {copiedSecretId === wh.id && <span className="text-success-text">Copied!</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60">
                  <button
                    type="button"
                    onClick={() => onTestPingWebhook(wh.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
                  >
                    <Send size={11} /> Test Ping
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(wh)}
                    className="p-1.5 rounded-lg text-danger-text hover:bg-danger-bg transition-colors cursor-pointer"
                    title="Delete endpoint"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Section 2: Failed Webhook Retries Queue ── */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <RefreshCw size={15} className="text-warning-text" />
              Failed Webhook Retries & Dead-Letter Queue
            </h2>
            <p className="text-xs text-muted-foreground">Undelivered webhook events queued for automatic exponential backoff or manual retry</p>
          </div>
        </div>

        <div className="space-y-3">
          {retries.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No failed webhooks in retry queue. All deliveries healthy!</p>
          ) : (
            retries.map((r) => {
              const isRetrying = isRetryingDeliveryId === r.id;
              return (
                <div
                  key={r.id}
                  className="rounded-xl border border-warning-bg bg-warning-bg/10 p-4 text-xs space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-warning-text flex items-center gap-1.5">
                        <AlertTriangle size={13} /> Status {r.statusCode}
                      </span>
                      <span className="font-mono text-foreground font-medium">{r.eventName}</span>
                      <span className="text-muted-foreground">• Attempts: {r.attemptsCount}/{r.maxAttempts}</span>
                    </div>

                    <button
                      type="button"
                      disabled={isRetrying}
                      onClick={() => onRetryDelivery(r.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-on-primary hover:opacity-90 cursor-pointer disabled:opacity-50 min-w-32 justify-center shadow-xs"
                    >
                      {isRetrying ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                      <span>Retry Delivery Now</span>
                    </button>
                  </div>

                  <p className="text-muted-foreground font-mono text-[11px] truncate">Target: {r.targetUrl}</p>
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
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-dialog text-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <h3 className="text-sm font-bold text-foreground">Register New Webhook Endpoint</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Webhook Target URL (HTTPS only)</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://api.yourdomain.com/webhooks/listen"
                  className="w-full font-mono rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Description / Consumer Name</label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. ERP integration or Slack notification bot"
                  className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Subscribe to Events</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 rounded-xl border border-border bg-muted/20">
                  {WEBHOOK_EVENT_CATALOG.map((ev) => (
                    <label key={ev} className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] text-foreground">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(ev)}
                        onChange={() => handleToggleEvent(ev)}
                        className="rounded border-border text-purple-600 focus:ring-purple-400"
                      />
                      <span className="font-mono truncate">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 font-semibold text-on-primary hover:opacity-90 cursor-pointer min-w-32 justify-center shadow-xs"
                >
                  {isCreating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  <span>Save Endpoint</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
