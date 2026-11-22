'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Building2, Hash, ShieldCheck, Save, Percent, FileText, CheckCircle2, RefreshCw
} from 'lucide-react';

export interface SuperadminGstTaxSettingsState {
  legalName: string;
  tradeName: string;
  billingAddress: string;
  city: string;
  state: string;
  stateCode: string;
  pinCode: string;
  gstin: string;
  sacCode: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  invoicePrefix: string;
  taxCalculationMode: 'exclusive' | 'inclusive';
}

const DEFAULT_GST_SETTINGS: SuperadminGstTaxSettingsState = {
  legalName: 'Smart Library Cloud Technologies India Pvt Ltd',
  tradeName: 'Smart Library SaaS',
  billingAddress: 'Tower B, Tech Innovation Hub, Outer Ring Road',
  city: 'New Delhi',
  state: 'Delhi',
  stateCode: '07',
  pinCode: '110001',
  gstin: '07AAACS9988D1Z2',
  sacCode: '998313',
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 18,
  invoicePrefix: 'INV-2026-',
  taxCalculationMode: 'exclusive',
};

export const SuperadminSettingsGeneralGstTaxCard: React.FC = () => {
  const [config, setConfig] = useState<SuperadminGstTaxSettingsState>(DEFAULT_GST_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('GST & Legal Tax Configuration saved and synced across all SaaS invoices.');
    }, 700);
  };

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 backdrop-blur-md shadow-xl shadow-black/40 p-6 space-y-6 hover:border-indigo-500/35 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Building2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">GST, Legal Entity & Tax Configuration</h2>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                <ShieldCheck size={10} /> Active
              </span>
            </div>
            <p className="text-xs text-slate-400">Platform legal entity, B2B SAC code, GSTIN, and tax rate rules.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
          <span>Save Tax Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Legal Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Legal Business Name <span className="text-rose-400">*</span>
          </label>
          <input maxLength={100}
            type="text"
            value={config.legalName}
            onChange={(e) => setConfig({ ...config, legalName: e.target.value })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-400"
            required
          />
        </div>

        {/* Trade Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Trade Brand Name <span className="text-rose-400">*</span>
          </label>
          <input maxLength={100}
            type="text"
            value={config.tradeName}
            onChange={(e) => setConfig({ ...config, tradeName: e.target.value })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-400"
            required
          />
        </div>

        {/* Office Address */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Registered Office Address <span className="text-rose-400">*</span>
          </label>
          <input maxLength={250}
            type="text"
            value={config.billingAddress}
            onChange={(e) => setConfig({ ...config, billingAddress: e.target.value })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-400"
            required
          />
        </div>

        {/* State & City & PIN */}
        <div className="grid grid-cols-3 gap-3 md:col-span-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">City</label>
            <input maxLength={100}
              type="text"
              value={config.city}
              onChange={(e) => setConfig({ ...config, city: e.target.value })}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">State & Code</label>
            <input maxLength={30}
              type="text"
              value={`${config.state} (${config.stateCode})`}
              onChange={(e) => setConfig({ ...config, state: e.target.value })}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">PIN Code</label>
            <input maxLength={30}
              type="text"
              value={config.pinCode}
              onChange={(e) => setConfig({ ...config, pinCode: e.target.value })}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* GSTIN & SAC Code */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            15-Digit GSTIN <span className="text-rose-400">*</span>
          </label>
          <input maxLength={100}
            type="text"
            value={config.gstin}
            onChange={(e) => setConfig({ ...config, gstin: e.target.value.toUpperCase() })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 font-mono text-xs sm:text-sm text-indigo-300 focus:outline-none focus:border-indigo-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            SAC Code (SaaS Provisioning) <span className="text-rose-400">*</span>
          </label>
          <input maxLength={30}
            type="text"
            value={config.sacCode}
            onChange={(e) => setConfig({ ...config, sacCode: e.target.value })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 font-mono text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-400"
            required
          />
        </div>

        {/* Tax Rates */}
        <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-slate-950/60 md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">GST Slab Rates</span>
            <span className="text-[11px] text-slate-400">Intra-State: CGST+SGST | Inter-State: IGST</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-border/40 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">CGST Rate</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{config.cgstRate}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-border/40 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">SGST Rate</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{config.sgstRate}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-border/40 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">IGST Rate</span>
              <span className="text-sm font-bold text-indigo-400 font-mono">{config.igstRate}%</span>
            </div>
          </div>
        </div>

        {/* Invoice Numbering Prefix */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Invoice Numbering Prefix
          </label>
          <input maxLength={100}
            type="text"
            value={config.invoicePrefix}
            onChange={(e) => setConfig({ ...config, invoicePrefix: e.target.value })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 font-mono text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* Tax Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Tax Calculation Mode
          </label>
          <select
            value={config.taxCalculationMode}
            onChange={(e) => setConfig({ ...config, taxCalculationMode: e.target.value as any })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-400"
          >
            <option value="exclusive">Exclusive (Tax added on top of base plan price)</option>
            <option value="inclusive">Inclusive (Base plan price already includes GST)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
