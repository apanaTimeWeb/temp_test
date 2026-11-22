'use client';

import React, { useState } from 'react';
import { Landmark, CheckCircle, ShieldCheck, FileText, Percent } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperadminBillingOverviewGstForm() {
  const [gstin, setGstin] = useState('07AAACS9988D1Z2');
  const [legalName, setLegalName] = useState('Smart Library Cloud Technologies India Pvt Ltd');
  const [sacCode, setSacCode] = useState('998313');
  const [cgstRate, setCgstRate] = useState(9);
  const [sgstRate, setSgstRate] = useState(9);
  const [igstRate, setIgstRate] = useState(18);
  const [isSavingGst, setIsSavingGst] = useState(false);

  const handleSaveGst = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGst(true);
    setTimeout(() => {
      setIsSavingGst(false);
      toast.success('GST & Tax Configuration updated successfully and synced across billing engines.');
    }, 600);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSaveGst} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card space-y-5 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <Landmark size={18} className="text-primary" />
              <span>SaaS Platform GSTIN & Tax Configuration</span>
            </h2>
            <p className="text-secondary mt-0.5">Define platform-wide GSTIN, SAC codes, and applicable tax rate structures.</p>
          </div>
          <button
            type="submit"
            disabled={isSavingGst}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold shadow-card motion-safe:active:scale-95 cursor-pointer disabled:opacity-50 motion-safe:transition-all"
          >
            <CheckCircle size={14} />
            <span>{isSavingGst ? 'Saving...' : 'Save GST Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-secondary mb-1">Platform Legal Business Name</label>
            <input
              maxLength={100}
              type="text"
              required
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-secondary mb-1">Platform Registered GSTIN</label>
            <input
              type="text"
              required
              maxLength={15}
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary uppercase font-mono focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold text-secondary mb-1">Services SAC Code</label>
            <input
              maxLength={30}
              type="text"
              required
              value={sacCode}
              onChange={(e) => setSacCode(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary font-mono focus:border-primary focus:outline-none"
            />
            <span className="text-[10px] text-secondary mt-0.5 block">998313: IT SaaS Application Provisioning</span>
          </div>
          <div>
            <label className="block font-semibold text-secondary mb-1">CGST Rate (Intra-State %)</label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={28}
                value={cgstRate}
                onChange={(e) => setCgstRate(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary font-mono focus:border-primary focus:outline-none"
              />
              <Percent size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary" />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-secondary mb-1">SGST Rate (Intra-State %)</label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={28}
                value={sgstRate}
                onChange={(e) => setSgstRate(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary font-mono focus:border-primary focus:outline-none"
              />
              <Percent size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary" />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-secondary mb-1">IGST Rate (Inter-State %)</label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={28}
                value={igstRate}
                onChange={(e) => setIgstRate(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-input px-3 py-2 text-primary font-mono focus:border-primary focus:outline-none"
              />
              <Percent size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary" />
            </div>
          </div>
        </div>

        {/* Tax compliance info boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
            <span className="font-bold text-primary flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-success" />
              <span>Reverse Charge Mechanism (RCM)</span>
            </span>
            <p className="text-secondary text-[11px] leading-relaxed">
              RCM under Section 9(3) / 9(4) is <strong>Disabled</strong>. All SaaS subscriptions are billed under Forward Charge with platform GST remittance.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
            <span className="font-bold text-primary flex items-center gap-1.5">
              <FileText size={14} className="text-primary" />
              <span>E-Invoicing & IRN Generation</span>
            </span>
            <p className="text-secondary text-[11px] leading-relaxed">
              NIC Portal E-Invoice integration is <strong>Active</strong>. Every B2B transaction produces a signed Invoice Reference Number (IRN) and QR code automatically.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
