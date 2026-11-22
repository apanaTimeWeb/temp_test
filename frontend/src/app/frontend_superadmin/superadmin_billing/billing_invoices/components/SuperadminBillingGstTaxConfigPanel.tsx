'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Building2, Hash, ShieldCheck, Save, Percent, FileText, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import type { SuperadminGstTaxConfig } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
import { SUPERADMIN_BILLING_DEFAULT_TAX_CONFIG } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/mocks/fixtures/SuperadminBillingExpandedFixtures';

export default function SuperadminBillingGstTaxConfigPanel() {
  const [config, setConfig] = useState<SuperadminGstTaxConfig>(SUPERADMIN_BILLING_DEFAULT_TAX_CONFIG);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('GST & Tax Configuration updated successfully.');
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/60 to-[#0c0f2b] backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="text-indigo-400" size={20} />
            <h2 className="text-lg font-bold text-white tracking-tight">Legal Entity, GSTIN & Tax Configuration</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={11} /> GST Compliance Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Configure platform legal details, B2B Tax Invoice numbering sequences, SAC codes, and intra/inter-state GST rates.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          <span>Save Tax Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Legal Entity & Billing Address */}
        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#090d29]/95 space-y-4">
          <div className="flex items-center gap-2 border-b border-indigo-500/15 pb-3">
            <Building2 size={16} className="text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">Platform Legal & Billing Address</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Legal Business Name (Registered)</label>
              <input
                type="text"
                value={config.legalName}
                onChange={(e) => setConfig({ ...config, legalName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 focus:outline-none focus:border-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Trade Name (Brand)</label>
              <input
                type="text"
                value={config.tradeName}
                onChange={(e) => setConfig({ ...config, tradeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 focus:outline-none focus:border-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Registered Office Address</label>
              <textarea
                rows={2}
                value={config.billingAddress}
                onChange={(e) => setConfig({ ...config, billingAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 focus:outline-none focus:border-indigo-400"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">State</label>
                <input
                  type="text"
                  value={config.state}
                  onChange={(e) => setConfig({ ...config, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">State Code</label>
                <input
                  type="text"
                  value={config.stateCode}
                  onChange={(e) => setConfig({ ...config, stateCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">PIN Code</label>
                <input
                  type="text"
                  value={config.pinCode}
                  onChange={(e) => setConfig({ ...config, pinCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: GSTIN, SAC & Tax Rates */}
        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#090d29]/95 space-y-4">
          <div className="flex items-center gap-2 border-b border-indigo-500/15 pb-3">
            <Percent size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">GSTIN, SAC Code & Tax Calculation Rules</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Platform GSTIN</label>
                <input
                  type="text"
                  value={config.gstin}
                  onChange={(e) => setConfig({ ...config, gstin: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-indigo-300 font-mono font-bold focus:outline-none focus:border-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">SAC Code (SaaS)</label>
                <input
                  type="text"
                  value={config.sacCode}
                  onChange={(e) => setConfig({ ...config, sacCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 space-y-2">
              <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Dual-Tax Calculation Logic</div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                <div>• Intra-State: <strong>CGST 9% + SGST 9% (Total 18%)</strong></div>
                <div>• Inter-State: <strong>IGST 18%</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-500/20 bg-[#060818]">
              <div>
                <div className="text-slate-200 font-medium">Reverse Charge Mechanism (RCM)</div>
                <div className="text-[10px] text-slate-500">Applicable for specific export or exempted overseas clients</div>
              </div>
              <input
                type="checkbox"
                checked={config.rcmApplicable}
                onChange={(e) => setConfig({ ...config, rcmApplicable: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Invoice Number Sequence */}
        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#090d29]/95 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-indigo-500/15 pb-3">
            <Hash size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Invoice Number Sequence & Automated Billing Schedule</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Tax Invoice Prefix</label>
              <input
                type="text"
                value={config.invoicePrefix}
                onChange={(e) => setConfig({ ...config, invoicePrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Example: {config.invoicePrefix}0001</span>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Credit Note Prefix</label>
              <input
                type="text"
                value={config.creditNotePrefix}
                onChange={(e) => setConfig({ ...config, creditNotePrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Example: {config.creditNotePrefix}0001</span>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Next Sequential Number</label>
              <input
                type="number"
                value={config.nextInvoiceNumber}
                onChange={(e) => setConfig({ ...config, nextInvoiceNumber: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Auto-increments on generation</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
