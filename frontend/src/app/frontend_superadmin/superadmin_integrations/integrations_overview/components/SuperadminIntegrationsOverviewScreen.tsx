'use client';

import React, { useState } from 'react';
import {
  Cable,
  CheckCircle2,
  Copy,
  CreditCard,
  Key,
  Layers,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Webhook,
  XCircle,
} from 'lucide-react';

interface GatewayItem {
  id: string;
  name: string;
  category: 'payment' | 'messaging' | 'webhook';
  status: 'connected' | 'disconnected' | 'test_mode';
  environment: 'Production' | 'Sandbox';
  lastPing: string;
}

const GATEWAYS: GatewayItem[] = [
  {
    id: 'razorpay',
    name: 'Razorpay Payment Gateway (India)',
    category: 'payment',
    status: 'connected',
    environment: 'Production',
    lastPing: '2 mins ago',
  },
  {
    id: 'stripe',
    name: 'Stripe Global Gateway',
    category: 'payment',
    status: 'test_mode',
    environment: 'Sandbox',
    lastPing: '1 hour ago',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business Cloud API (Meta)',
    category: 'messaging',
    status: 'connected',
    environment: 'Production',
    lastPing: 'Just now',
  },
  {
    id: 'msg91',
    name: 'MSG91 Enterprise SMS Gateway',
    category: 'messaging',
    status: 'connected',
    environment: 'Production',
    lastPing: '5 mins ago',
  },
  {
    id: 'webhook_accounting',
    name: 'Tally / ERP Sync Webhook Service',
    category: 'webhook',
    status: 'connected',
    environment: 'Production',
    lastPing: '12 mins ago',
  },
];

export default function SuperadminIntegrationsOverviewScreen() {
  const [activeTab, setActiveTab] = useState<'gateways' | 'webhooks' | 'apikeys'>('gateways');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Cable size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                13. Integration & API Management
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-semibold">
                  SaaS Hub
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                Payment gateways, SMS, WhatsApp, webhooks, APIs & developer integrations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['gateways', 'webhooks', 'apikeys'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab === 'gateways' ? 'Connected Gateways' : tab === 'webhooks' ? 'Platform Webhooks' : 'Platform API Keys'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'gateways' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GATEWAYS.map((gw) => (
              <div key={gw.id} className="p-5 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{gw.name}</h3>
                    <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
                      <span className="uppercase text-[10px] px-1.5 py-0.2 bg-neutral-800 rounded font-semibold">
                        {gw.environment}
                      </span>
                      <span>Ping: {gw.lastPing}</span>
                    </div>
                  </div>
                  <div>
                    {gw.status === 'connected' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={12} /> Live Connected
                      </span>
                    )}
                    {gw.status === 'test_mode' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Sandbox / Test
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-neutral-500">Service: {gw.category}</span>
                  <button className="text-purple-400 hover:underline font-medium">
                    Configure Keys & Secrets →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Webhook size={16} className="text-purple-400" />
                Active Platform Webhooks
              </h2>
              <p className="text-xs text-neutral-400">Real-time HTTP callbacks sent on system triggers</p>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors">
              <Plus size={14} /> Add Webhook Endpoint
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                url: 'https://api.libraryos.io/hooks/tenant-provisioned',
                events: ['tenant.created', 'branch.created', 'admin.invited'],
                status: '200 OK',
                successRate: '99.8%',
              },
              {
                url: 'https://billing.libraryos.io/hooks/invoice-settled',
                events: ['invoice.paid', 'payment.collected', 'refund.processed'],
                status: '200 OK',
                successRate: '100%',
              },
            ].map((wh, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-border/80 bg-neutral-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-mono text-purple-300 font-semibold">{wh.url}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {wh.events.map((ev) => (
                      <span key={ev} className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 text-[10px]">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-semibold">{wh.status}</span>
                  <span className="text-neutral-500">Rate: {wh.successRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'apikeys' && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Key size={16} className="text-purple-400" />
                SuperAdmin Platform API Keys
              </h2>
              <p className="text-xs text-neutral-400">Tokens for server-to-server SuperAdmin automation</p>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors">
              <Plus size={14} /> Generate New Key
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'Production Worker Daemon Key',
                key: 'pk_live_94a8e23901bca7f920199',
                created: '2026-02-14',
                lastUsed: '2 mins ago',
              },
              {
                name: 'Analytics ETL Pipeline Token',
                key: 'pk_live_7718cc9011abfa9301821',
                created: '2026-03-01',
                lastUsed: '1 hour ago',
              },
            ].map((k, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-border/80 bg-neutral-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-white">{k.name}</div>
                  <div className="font-mono text-neutral-400 mt-1 flex items-center gap-2">
                    <span>{k.key}</span>
                    <button
                      onClick={() => handleCopy(k.key, k.key)}
                      className="text-neutral-500 hover:text-white"
                      title="Copy Key"
                    >
                      <Copy size={13} />
                    </button>
                    {copiedId === k.key && <span className="text-emerald-400 text-[10px]">Copied!</span>}
                  </div>
                </div>
                <div className="text-neutral-500 text-right">
                  <div>Created: {k.created}</div>
                  <div>Used: {k.lastUsed}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
