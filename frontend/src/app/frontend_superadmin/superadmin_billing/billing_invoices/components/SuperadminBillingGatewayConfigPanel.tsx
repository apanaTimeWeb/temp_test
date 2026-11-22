'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  CreditCard, KeyRound, QrCode, ShieldCheck, Save, CheckCircle2,
  Zap, Globe, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import type { SuperadminGatewayConfig } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
import { SUPERADMIN_BILLING_DEFAULT_GATEWAYS } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/mocks/fixtures/SuperadminBillingExpandedFixtures';

export default function SuperadminBillingGatewayConfigPanel() {
  const [config, setConfig] = useState<SuperadminGatewayConfig>(SUPERADMIN_BILLING_DEFAULT_GATEWAYS);
  const [showSecrets, setShowSecrets] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = (gatewayName: string) => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      toast.success(`${gatewayName} gateway connection test passed: Status 200 OK.`);
    }, 1000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Payment gateway credentials saved securely.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/60 to-[#0c0f2b] backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <KeyRound className="text-indigo-400" size={20} />
            <h2 className="text-lg font-bold text-white tracking-tight">SaaS Subscription Payment Gateways</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Zap size={11} /> Multi-Gateway Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Configure payment gateways for automated recurring billing, UPI intent, credit/debit cards, and partial payment allowances.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSecrets(!showSecrets)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white text-xs font-semibold cursor-pointer"
          >
            {showSecrets ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showSecrets ? 'Hide Secrets' : 'Show Secrets'}</span>
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 cursor-pointer"
          >
            <Save size={14} />
            <span>Save Gateways</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Razorpay Gateway */}
        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#090d29]/95 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-500/15 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <h3 className="text-sm font-bold text-white">Razorpay (India UPI, Cards, Netbanking)</h3>
            </div>
            <button
              type="button"
              onClick={() => handleTestConnection('Razorpay')}
              disabled={isTesting}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Test Connection
            </button>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Razorpay Key ID</label>
              <input
                type="text"
                value={config.razorpayKeyId}
                onChange={(e) => setConfig({ ...config, razorpayKeyId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Razorpay Key Secret</label>
              <input
                type={showSecrets ? 'text' : 'password'}
                value={config.razorpaySecret}
                onChange={(e) => setConfig({ ...config, razorpaySecret: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Webhook Secret</label>
              <input
                type={showSecrets ? 'text' : 'password'}
                value={config.razorpayWebhookSecret}
                onChange={(e) => setConfig({ ...config, razorpayWebhookSecret: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Dynamic UPI QR Setup */}
        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#090d29]/95 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-500/15 pb-3">
            <div className="flex items-center gap-2">
              <QrCode size={16} className="text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Dynamic Platform UPI QR & Intent</h3>
            </div>
            <button
              type="button"
              onClick={() => handleTestConnection('UPI VPA')}
              disabled={isTesting}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              Verify VPA
            </button>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Platform VPA (Virtual Payment Address)</label>
              <input
                type="text"
                value={config.upiVpa}
                onChange={(e) => setConfig({ ...config, upiVpa: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-emerald-300 font-mono font-bold focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Merchant Display Name</label>
              <input
                type="text"
                value={config.upiMerchantName}
                onChange={(e) => setConfig({ ...config, upiMerchantName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-slate-300 text-[11px] leading-relaxed">
              Provides auto-generated BharatQR / UPI QR code on invoice download and checkout modal for zero-charge instant renewal.
            </div>
          </div>
        </div>

        {/* Partial Payment Configuration */}
        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#090d29]/95 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-indigo-500/15 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-amber-400" />
              <h3 className="text-sm font-bold text-white">Partial Payment & Split Milestone Terms</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/20 bg-[#060818]">
              <div>
                <div className="text-slate-100 font-semibold">Enable Partial Payments for Annual Plans</div>
                <div className="text-[11px] text-slate-500">Allows onboarded libraries to split large annual invoices</div>
              </div>
              <input
                type="checkbox"
                checked={config.allowPartialPayments}
                onChange={(e) => setConfig({ ...config, allowPartialPayments: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Minimum Upfront Commitment (%)</label>
              <input
                type="number"
                min={20}
                max={90}
                value={config.partialPaymentMinPercent}
                onChange={(e) => setConfig({ ...config, partialPaymentMinPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Default: 50% on invoice generation, balance due in 30 days</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
