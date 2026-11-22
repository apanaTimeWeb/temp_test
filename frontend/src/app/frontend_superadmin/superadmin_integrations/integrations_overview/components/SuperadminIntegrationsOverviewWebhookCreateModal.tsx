// components/SuperadminIntegrationsOverviewWebhookCreateModal.tsx
// RESPONSIBILITY: Modal form for registering a new webhook endpoint with event triggers.
// DATA FLOW: Form inputs -> SuperadminIntegrationsOverviewWebhookCreateModal -> onCreateWebhook.
'use client';

import { Loader2, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import {
  WEBHOOK_EVENT_CATALOG,
  type WebhookEventName,
} from '../constants/superadmin_integrations_overview.constants';
import type { WebhookCreatePayload } from '../types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewWebhookCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWebhook: (payload: WebhookCreatePayload) => void;
  isCreating?: boolean;
}

export const SuperadminIntegrationsOverviewWebhookCreateModal: React.FC<
  SuperadminIntegrationsOverviewWebhookCreateModalProps
> = ({ isOpen, onClose, onCreateWebhook, isCreating = false }) => {
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventName[]>([
    'tenant.created',
    'payment.success',
  ]);

  if (!isOpen) return null;

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
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="webhook-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c102b] via-[#090d24] to-[#050714] p-6 shadow-2xl text-slate-100 animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
          <h3 id="webhook-modal-title" className="text-sm font-bold text-slate-100">
            Register New Webhook Endpoint
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors p-1"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Webhook Target URL (HTTPS only)
            </label>
            <input
              type="url"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://api.yourdomain.com/webhooks/listen"
              className="w-full font-mono rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Description / Consumer Name
            </label>
            <input
              type="text"
              required
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="e.g. ERP integration or Webhook notification service"
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Subscribe to Events
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2.5 rounded-xl border border-indigo-500/20 bg-slate-950/80 shadow-inner">
              {WEBHOOK_EVENT_CATALOG.map((ev) => (
                <label
                  key={ev}
                  className="inline-flex items-center gap-2 cursor-pointer text-[11px] text-slate-300 hover:text-slate-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(ev)}
                    onChange={() => handleToggleEvent(ev)}
                    className="rounded border-indigo-500/30 bg-slate-900 text-indigo-500 focus:ring-indigo-400"
                  />
                  <span className="font-mono truncate">{ev}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-500/20 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-indigo-500/20 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-1.5 font-semibold text-white cursor-pointer min-w-32 justify-center shadow-md shadow-indigo-500/25 transition-opacity"
            >
              {isCreating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              <span>Save Endpoint</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
