'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface CreditNote {
  id: string;
  tenant: string;
  invoiceId: string;
  amount: number;
  reason: string;
  ref: string;
  status: string;
  date: string;
}

const SAMPLE_CREDIT_NOTES: CreditNote[] = [
  { id: 'CN-2026-0001', tenant: 'Silicon Valley Institute Lib', invoiceId: 'INV-2026-0004', amount: 5899, reason: 'Duplicate Mandate Reversed', ref: 'rfnd_rzp_88491', status: 'Settled', date: '19 Nov, 2026' },
  { id: 'CN-2026-0002', tenant: 'Pioneer Reading Rooms', invoiceId: 'INV-2026-0006', amount: 2999, reason: 'Prorated Plan Adjustment', ref: 'rfnd_stp_44102', status: 'Settled', date: '16 Nov, 2026' },
  { id: 'CN-2026-0003', tenant: 'Horizon Study Space', invoiceId: 'INV-2026-0008', amount: 5602, reason: 'Early Upgrade Credit', ref: 'rfnd_rzp_11902', status: 'Settled', date: '12 Nov, 2026' },
];

export default function SuperadminBillingOverviewRefundsTab() {
  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_billing:refunds:feedback' });
  };

  return (
    <div className="space-y-4">
      {/* Refund KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card shadow-card">
          <span className="text-[10px] uppercase font-bold text-secondary">Total Refunded (FY 26-27)</span>
          <p className="text-lg font-black text-primary font-mono mt-1">₹14,500</p>
          <span className="text-[10px] text-success">100% gateway reversed</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-card">
          <span className="text-[10px] uppercase font-bold text-secondary">Credit Notes Emitted</span>
          <p className="text-lg font-black text-primary font-mono mt-1">3 Notes</p>
          <span className="text-[10px] text-secondary">Sequential CN-2026</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-card">
          <span className="text-[10px] uppercase font-bold text-secondary">Active Disputes</span>
          <p className="text-lg font-black text-success font-mono mt-1">0 Open</p>
          <span className="text-[10px] text-success">Clean dispute history</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-card">
          <span className="text-[10px] uppercase font-bold text-secondary">Auto-Reversal SLA</span>
          <p className="text-lg font-black text-primary font-mono mt-1">&lt; 24h</p>
          <span className="text-[10px] text-secondary">Razorpay / Stripe Webhook</span>
        </div>
      </div>

      {/* Credit Notes Table */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            <span>Credit Notes & Refund Reversal Ledger</span>
          </h3>
          <span className="text-[11px] text-secondary">{SAMPLE_CREDIT_NOTES.length} Credit Notes</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left" role="table">
            <thead className="bg-primary-subtle text-[10px] uppercase font-bold text-secondary border-b border-border">
              <tr>
                <th className="p-3 sticky start-0 z-10 bg-primary-subtle border-e border-border">Credit Note ID</th>
                <th className="p-3">Tenant Library</th>
                <th className="p-3">Original Invoice</th>
                <th className="p-3">Reason</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3">Gateway Ref</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-primary">
              {SAMPLE_CREDIT_NOTES.map((cn) => (
                <tr key={cn.id} className="hover:bg-surface-hover motion-safe:transition-colors">
                  <td className="p-3 font-mono font-bold text-primary sticky start-0 z-10 bg-card border-e border-border">{cn.id}</td>
                  <td className="p-3 font-semibold text-primary">{cn.tenant}</td>
                  <td className="p-3 font-mono text-secondary">{cn.invoiceId}</td>
                  <td className="p-3 text-secondary">{cn.reason}</td>
                  <td className="p-3 text-right font-mono font-bold text-primary">₹{cn.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-mono text-[11px] text-secondary">{cn.ref}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success border border-border">
                      {cn.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => showToast(`Emitted Credit Note ${cn.id} receipt for ${cn.tenant}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-input text-secondary hover:text-primary hover:bg-surface-hover text-[11px] font-semibold cursor-pointer motion-safe:transition-all"
                    >
                      <Download size={11} />
                      <span>Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
