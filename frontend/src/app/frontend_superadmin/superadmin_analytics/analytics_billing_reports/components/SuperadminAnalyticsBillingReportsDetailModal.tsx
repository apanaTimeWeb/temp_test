'use client';
// RESPONSIBILITY: Render comprehensive invoice details, payment breakdown, and gateway transaction ledger in a Cyber-Luxury modal.

import React from 'react';
import { X, Receipt, CheckCircle2, Clock, AlertOctagon, RefreshCw, Printer, ShieldCheck } from 'lucide-react';
import type { BillingReportTableRecord } from '../types/SuperadminAnalyticsBillingReportsTypes';
import { BILLING_PAYMENT_STATUS_COLORS } from '../constants/SuperadminAnalyticsBillingReportsConstants';
import { formatBillingCurrency } from '../utils/SuperadminAnalyticsBillingReportsFormatters';

interface Props {
  record: BillingReportTableRecord | null;
  onClose: () => void;
}

export function SuperadminAnalyticsBillingReportsDetailModal({ record, onClose }: Props) {
  if (!record) return null;

  const statusCfg = BILLING_PAYMENT_STATUS_COLORS[record.paymentStatus] ?? {
    bg: 'bg-slate-800 text-slate-300',
  };

  const taxAmount = record.taxMinor ?? Math.round(record.amountMinor * 0.18);
  const subtotalAmount = Math.max(0, record.amountMinor - taxAmount);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="billing-detail-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-[#0a0d24]/95 text-white shadow-2xl shadow-indigo-950/60 backdrop-blur-xl space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Receipt size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="billing-detail-modal-title" className="text-base sm:text-lg font-black text-white tracking-tight">
                  Invoice Ledger
                </h2>
                <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30">
                  {record.invoiceNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {record.libraryName} • <span className="text-slate-300">{record.branchName}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] cursor-pointer transition-colors"
            aria-label="Close invoice details"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Top Financial Highlight Card ── */}
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-indigo-950/20 to-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Settled Amount</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">
              {formatBillingCurrency(record.amountMinor)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Includes 18% GST ({formatBillingCurrency(taxAmount)})
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider shadow-xs ${statusCfg.bg} ${statusCfg.text}`}>
              {record.paymentStatus}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Issued: {record.invoiceDate}
            </span>
          </div>
        </div>

        {/* ── Detailed Breakdown Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Subscription & Account Info */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <ShieldCheck size={13} />
              <span>Subscription & Account</span>
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Library:</span>
                <span className="font-semibold text-white text-right">{record.libraryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Branch Unit:</span>
                <span className="font-medium text-slate-200">{record.branchName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subscription Tier:</span>
                <span className="font-semibold text-sky-400">{record.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Billing Cadence:</span>
                <span className="font-mono text-slate-300 uppercase">{record.billingCycle}</span>
              </div>
            </div>
          </div>

          {/* Payment & Gateway Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>Payment & Settlement</span>
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="font-semibold text-white">{record.paymentMethod.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-indigo-500/20 text-amber-300 truncate max-w-[140px]">
                  {record.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Due Date:</span>
                <span className="font-mono text-slate-300">{record.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Settled At:</span>
                <span className="font-mono text-slate-300">{record.paidAt ?? 'Awaiting Confirmation'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Financial Ledger Subtotal & Tax Row ── */}
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-indigo-500/15 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Base Subscription Fee:</span>
            <span className="font-mono text-slate-200">{formatBillingCurrency(subtotalAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Integrated GST / Tax (18%):</span>
            <span className="font-mono text-slate-200">{formatBillingCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-indigo-500/15 font-bold text-white text-sm">
            <span>Gross Payable Total:</span>
            <span className="font-mono text-emerald-400">{formatBillingCurrency(record.amountMinor)}</span>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-between pt-2 border-t border-indigo-500/20 gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <Printer size={13} />
            <span>Print Invoice</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-white transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
