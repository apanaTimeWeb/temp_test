'use client';

import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import {
AlertTriangle,
Check,
CheckCircle2,
Coins,
Copy,
Printer,
Receipt,
RotateCcw,
Send,
X
} from 'lucide-react';
import { useEffect,useMemo,useState } from 'react';
import { toast } from 'sonner';

export interface DenominationCounts {
  n500: number;
  n200: number;
  n100: number;
  n50: number;
  n20: number;
  n10: number;
  coins: number;
}

export interface ManagerAccountsDailySettlementDenominationAndHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: Entry | null;
  formatCurrency?: (val: number) => string;
  onConfirmSettlement?: (data: {
    totalCounted: number;
    handoverToOwner: number;
    retainedFloat: number;
    discrepancy: number;
    ownerName: string;
  }) => void;
}

export const DENOMINATIONS = [
  { key: 'n500', value: 500, label: '₹500 Note' },
  { key: 'n200', value: 200, label: '₹200 Note' },
  { key: 'n100', value: 100, label: '₹100 Note' },
  { key: 'n50', value: 50, label: '₹50 Note' },
  { key: 'n20', value: 20, label: '₹20 Note' },
  { key: 'n10', value: 10, label: '₹10 Note' },
  { key: 'coins', value: 1, label: 'Coins (₹5 / ₹2 / ₹1)' },
] as const;

export function ManagerAccountsDailySettlementDenominationAndHandoverModal({
  isOpen,
  onClose,
  entry,
  formatCurrency = (v) => `₹${(v / 100).toLocaleString('en-IN')}`,
  onConfirmSettlement,
}: ManagerAccountsDailySettlementDenominationAndHandoverModalProps) {
  // Expected closing cash in Rupees
  const expectedCashRupees = useMemo(() => {
    if (!entry) return 8500;
    return Math.round(entry.closingBalance / 100);
  }, [entry]);

  // Initial denomination count prefilled to roughly match expected cash
  const [counts, setCounts] = useState<DenominationCounts>({
    n500: Math.floor(expectedCashRupees / 500),
    n200: Math.floor((expectedCashRupees % 500) / 200),
    n100: Math.floor(((expectedCashRupees % 500) % 200) / 100),
    n50: 0,
    n20: 0,
    n10: 0,
    coins: 0,
  });

  const [retainedFloat, setRetainedFloat] = useState<number>(500);
  const [ownerName, setOwnerName] = useState<string>('Library Owner (Mr. R.K. Agarwal)');
  const [managerName, setManagerName] = useState<string>('Branch Manager Satyam');
  const [notes, setNotes] = useState<string>('Shift closing physical cash verified & handed over.');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'counter' | 'receipt'>('counter');

  // Reset when modal opens with new entry
  useEffect(() => {
    if (!isOpen) return;
    const exp = entry ? Math.round(entry.closingBalance / 100) : 8500;
    setCounts({
      n500: Math.floor(exp / 500),
      n200: Math.floor((exp % 500) / 200),
      n100: Math.floor(((exp % 500) % 200) / 100),
      n50: 0,
      n20: 0,
      n10: 0,
      coins: 0,
    });
    setRetainedFloat(500);
    setActiveTab('counter');
  }, [isOpen, entry]);

  // Keyboard escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Calculate total physical cash
  const totalPhysicalCash = useMemo(() => {
    return (
      (counts.n500 || 0) * 500 +
      (counts.n200 || 0) * 200 +
      (counts.n100 || 0) * 100 +
      (counts.n50 || 0) * 50 +
      (counts.n20 || 0) * 20 +
      (counts.n10 || 0) * 10 +
      (counts.coins || 0)
    );
  }, [counts]);

  const discrepancy = totalPhysicalCash - expectedCashRupees;
  const handoverAmount = Math.max(0, totalPhysicalCash - (Number(retainedFloat) || 0));

  const handleCountChange = (key: keyof DenominationCounts, value: string) => {
    const n = Math.max(0, parseInt(value || '0', 10));
    setCounts((prev) => ({ ...prev, [key]: Number.isNaN(n) ? 0 : n }));
  };

  const handleReset = () => {
    setCounts({
      n500: 0,
      n200: 0,
      n100: 0,
      n50: 0,
      n20: 0,
      n10: 0,
      coins: 0,
    });
    toast.info('Denominations reset to zero.');
  };

  const generateWhatsAppSummary = () => {
    const shift = entry ? entry.shift : 'Daily Shift';
    const date = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return (
      `📋 *DAILY CASH HANDOVER & SETTLEMENT RECEIPT*\n` +
      `🏢 Central Study Hub — Branch 1\n` +
      `📅 Date: ${date} | Shift: ${shift}\n` +
      `────────────────────────\n` +
      `💵 *Denomination Breakdown:*\n` +
      `• ₹500 x ${counts.n500} = ₹${counts.n500 * 500}\n` +
      `• ₹200 x ${counts.n200} = ₹${counts.n200 * 200}\n` +
      `• ₹100 x ${counts.n100} = ₹${counts.n100 * 100}\n` +
      `• ₹50 x ${counts.n50} = ₹${counts.n50 * 50}\n` +
      `• ₹20 x ${counts.n20} = ₹${counts.n20 * 20}\n` +
      `• ₹10 x ${counts.n10} = ₹${counts.n10 * 10}\n` +
      `• Coins = ₹${counts.coins}\n` +
      `────────────────────────\n` +
      `💰 *Total Cash in Drawer:* ₹${totalPhysicalCash.toLocaleString('en-IN')}\n` +
      `🎯 *Expected Cash:* ₹${expectedCashRupees.toLocaleString('en-IN')}\n` +
      `⚖️ *Discrepancy:* ${
        discrepancy === 0
          ? '₹0 (Exact Match ✓)'
          : discrepancy > 0
          ? `+₹${discrepancy} (Surplus)`
          : `-₹${Math.abs(discrepancy)} (Shortage)`
      }\n` +
      `────────────────────────\n` +
      `🤝 *Handed Over to Owner:* ₹${handoverAmount.toLocaleString('en-IN')}\n` +
      `🔒 *Retained Drawer Float (Tomorrow):* ₹${retainedFloat.toLocaleString('en-IN')}\n` +
      `👤 Handed By: ${managerName}\n` +
      `👑 Received By: ${ownerName}\n` +
      `✅ Sign-off Status: Verified & Balanced`
    );
  };

  const handleCopyWhatsApp = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(generateWhatsAppSummary());
      setCopied(true);
      toast.success('Cash handover receipt copied for WhatsApp!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleConfirm = () => {
    if (onConfirmSettlement) {
      onConfirmSettlement({
        totalCounted: totalPhysicalCash,
        handoverToOwner: handoverAmount,
        retainedFloat: Number(retainedFloat) || 0,
        discrepancy,
        ownerName,
      });
    }
    toast.success(
      `Shift settlement confirmed! Handed over ₹${handoverAmount.toLocaleString('en-IN')} to ${ownerName}.`
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="denomination-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden my-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface-highlight/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Coins size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="denomination-modal-title" className="text-base font-bold text-primary">
                  Currency Denomination Counter & Owner Handover
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {entry?.shift || 'Daily Shift'}
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Physical note counting tool and transparent owner cash handover sign-off receipt
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle: Counter vs Printable Receipt */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('counter')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'counter'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              <Coins size={14} />
              <span>Denomination Counter</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('receipt')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'receipt'
                  ? 'border-sky-500 text-sky-400 font-bold'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              <Receipt size={14} />
              <span>Owner Handover Receipt</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'WhatsApp Summary'}</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto space-y-5">
          {activeTab === 'counter' ? (
            <div className="space-y-5">
              {/* Top Reconciliation Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Physical Total Counted */}
                <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs space-y-1">
                  <span className="text-[11px] text-secondary font-medium uppercase tracking-wider block">
                    Physical Cash Counted
                  </span>
                  <div className="text-xl font-black font-mono text-primary flex items-center">
                    ₹{totalPhysicalCash.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-secondary">Sum of all currency notes</span>
                </div>

                {/* Expected Cash in Drawer */}
                <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs space-y-1">
                  <span className="text-[11px] text-secondary font-medium uppercase tracking-wider block">
                    Expected Drawer Cash
                  </span>
                  <div className="text-xl font-black font-mono text-secondary flex items-center">
                    ₹{expectedCashRupees.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-secondary">Per shift cash ledger</span>
                </div>

                {/* Discrepancy Status */}
                <div
                  className={`p-3.5 rounded-xl border shadow-xs space-y-1 ${
                    discrepancy === 0
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : discrepancy > 0
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider block">
                    Cash Discrepancy
                  </span>
                  <div className="text-xl font-black font-mono flex items-center gap-1.5">
                    {discrepancy === 0 ? (
                      <>
                        <CheckCircle2 size={18} />
                        <span>₹0 (Matched)</span>
                      </>
                    ) : discrepancy > 0 ? (
                      <>
                        <AlertTriangle size={18} />
                        <span>+₹{discrepancy} (Surplus)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={18} />
                        <span>-₹{Math.abs(discrepancy)} (Shortage)</span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] opacity-80">
                    {discrepancy === 0
                      ? '100% drawer cash balanced'
                      : discrepancy > 0
                      ? 'Extra cash present in drawer'
                      : 'Cash missing from physical drawer'}
                  </span>
                </div>
              </div>

              {/* Denomination Counter Table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-surface-highlight border-b border-border">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Coins size={14} className="text-emerald-400" />
                    <span>Currency Denominations</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] text-secondary hover:text-primary flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={11} />
                    <span>Reset Counts</span>
                  </button>
                </div>

                <div className="divide-y divide-border/60">
                  {DENOMINATIONS.map((d) => {
                    const count = counts[d.key as keyof DenominationCounts] || 0;
                    const subtotal = count * d.value;
                    return (
                      <div
                        key={d.key}
                        className="flex items-center justify-between px-4 py-2 hover:bg-surface-hover/50 transition-colors gap-3"
                      >
                        <div className="flex items-center gap-3 w-40">
                          <span className="w-8 h-8 rounded-lg bg-surface-highlight text-primary font-bold text-xs flex items-center justify-center border border-border">
                            ₹{d.value === 1 ? 'Coins' : d.value}
                          </span>
                          <span className="text-xs font-semibold text-primary">{d.label}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-secondary font-mono">×</span>
                          <input
                            type="number"
                            min="0"
                            value={count || ''}
                            onChange={(e) =>
                              handleCountChange(d.key as keyof DenominationCounts, e.target.value)
                            }
                            placeholder="0"
                            className="w-24 px-3 py-1.5 text-center text-xs font-mono font-bold bg-background border border-border rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="w-28 text-right font-mono font-bold text-xs text-primary">
                          = ₹{subtotal.toLocaleString('en-IN')}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between px-4 py-3 bg-surface-highlight/70 border-t border-border font-bold text-xs">
                  <span className="text-primary">Total Physical Cash in Drawer</span>
                  <span className="text-base text-emerald-400 font-mono">
                    ₹{totalPhysicalCash.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Owner Cash Handover Split Controls */}
              <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <HandshakeIcon size={14} className="text-sky-400" />
                  <span>Owner Cash Handover & Retained Float Split</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-secondary font-medium block mb-1">
                      Retained Petty Cash Float for Tomorrow Morning
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={retainedFloat}
                        onChange={(e) => setRetainedFloat(Number(e.target.value) || 0)}
                        placeholder="500"
                        className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold bg-background border border-border rounded-lg outline-none focus:border-sky-500"
                      />
                    </div>
                    <span className="text-[10px] text-secondary mt-0.5 block">
                      Amount left in the counter cash drawer for morning change
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-secondary font-medium block mb-1">
                      Net Cash Handed Over to Library Owner
                    </label>
                    <div className="px-3 py-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono font-bold text-sm flex items-center justify-between">
                      <span>To Handover:</span>
                      <span>₹{handoverAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="text-[10px] text-sky-400/80 mt-0.5 block">
                      Total Counted (₹{totalPhysicalCash.toLocaleString('en-IN')}) - Retained Float (₹{retainedFloat.toLocaleString('en-IN')})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-[11px] text-secondary block mb-1">
                      Handover Received By (Owner / Authority)
                    </label>
                    <input maxLength={100}
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-secondary block mb-1">
                      Handed Over By (Manager / Cashier)
                    </label>
                    <input maxLength={100}
                      type="text"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Printable Owner Handover Sign-off Receipt */
            <div className="space-y-4">
              <div
                id="printable-cash-handover-slip"
                className="p-6 rounded-2xl border-2 border-border bg-white text-slate-900 shadow-md font-sans space-y-4"
              >
                {/* Receipt Header */}
                <div className="text-center border-b pb-3 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      LO
                    </span>
                    <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">
                      Library OS — Daily Cash Handover Receipt
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Branch: Central Study Hub - Main Branch | Phone: +91 98765 43210
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">
                    Receipt #{Date.now().toString().slice(-8)} • Shift: {entry?.shift || 'Daily Shift'} • Date: {new Date().toLocaleDateString('en-IN')}
                  </p>
                </div>

                {/* Handover Executive Summary */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block">Total Physical Cash in Drawer:</span>
                    <strong className="text-base text-slate-900 font-mono">
                      ₹{totalPhysicalCash.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Discrepancy vs Ledger:</span>
                    <strong className={discrepancy === 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {discrepancy === 0 ? '₹0 (Exact Match ✓)' : `₹${discrepancy} Difference`}
                    </strong>
                  </div>
                  <div className="border-t pt-2">
                    <span className="text-slate-500 block">Net Handed Over to Owner:</span>
                    <strong className="text-lg text-emerald-700 font-mono font-bold">
                      ₹{handoverAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="border-t pt-2">
                    <span className="text-slate-500 block">Retained Drawer Float (Tomorrow):</span>
                    <strong className="text-sm text-slate-800 font-mono">
                      ₹{retainedFloat.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* Denomination Detail Table */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Currency Denominations Detail
                  </h4>
                  <table className="w-full text-xs text-left border border-slate-200">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                      <tr>
                        <th className="py-1 px-3">Denomination</th>
                        <th className="py-1 px-3 text-center">Count</th>
                        <th className="py-1 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {DENOMINATIONS.map((d) => {
                        const count = counts[d.key as keyof DenominationCounts] || 0;
                        if (count === 0) return null;
                        return (
                          <tr key={d.key}>
                            <td className="py-1 px-3 font-sans">{d.label}</td>
                            <td className="py-1 px-3 text-center font-bold">{count}</td>
                            <td className="py-1 px-3 text-right">₹{(count * d.value).toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Dual Signature Sign-off Box */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                  <div className="space-y-4">
                    <div className="h-10 border-b border-dashed border-slate-400 flex items-end">
                      <span className="text-[10px] text-slate-400 italic">Signature / Digital Verified</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{managerName}</p>
                      <p className="text-[10px] text-slate-500">Handed Over By (Branch Manager)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-10 border-b border-dashed border-slate-400 flex items-end">
                      <span className="text-[10px] text-slate-400 italic">Signature / Receipt Acknowledged</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{ownerName}</p>
                      <p className="text-[10px] text-slate-500">Received & Confirmed By (Owner)</p>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 pt-2 border-t">
                  Generated via Library OS Daily Settlement Engine • Legally binding physical cash handover record
                </div>
              </div>

              {/* Action Toolbar for Receipt */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyWhatsApp}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                >
                  <Send size={13} />
                  <span>Send Summary on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card hover:bg-surface-hover text-secondary hover:text-primary border border-border text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print A4 / Thermal Slip</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-border bg-surface-highlight/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <Printer size={13} />
              <span>Print Slip</span>
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Confirm & Sign-Off Handover (₹{handoverAmount.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HandshakeIcon(props: { size?: number; className?: string }) {
  return (
    <svg
      width={props.size || 16}
      height={props.size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2-2" />
      <path d="m13 7-2-2a1 1 0 0 0-1.4 0L5.3 9.3a1 1 0 0 0 0 1.4l2 2" />
      <path d="M19 13v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export default ManagerAccountsDailySettlementDenominationAndHandoverModal;
