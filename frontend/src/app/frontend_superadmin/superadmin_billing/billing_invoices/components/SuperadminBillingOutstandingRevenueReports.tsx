'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  BarChart3, AlertOctagon, Send, ShieldAlert, Download, Printer,
  Calendar, IndianRupee, ArrowUpRight, TrendingUp, Clock, AlertTriangle
} from 'lucide-react';

interface OverdueTenantRecord {
  id: string;
  tenant: string;
  invoiceId: string;
  daysOverdue: number;
  amount: number;
  contact: string;
  phone: string;
}

const SAMPLE_OVERDUE_RECORDS: OverdueTenantRecord[] = [
  { id: '1', tenant: 'Pinnacle Study Spaces', invoiceId: 'INV-2026-0004', daysOverdue: 22, amount: 2950, contact: 'Vikram Joshi', phone: '+91 97111 88223' },
  { id: '2', tenant: 'Vanguard Learning Hub', invoiceId: 'INV-2026-0006', daysOverdue: 14, amount: 11800, contact: 'Anjali Deshmukh', phone: '+91 99222 33445' },
  { id: '3', tenant: 'Chanakya Reading Hall', invoiceId: 'INV-2026-0008', daysOverdue: 48, amount: 5900, contact: 'Sunil Verma', phone: '+91 98333 44556' },
];

export default function SuperadminBillingOutstandingRevenueReports() {
  const [records, setRecords] = useState<OverdueTenantRecord[]>(SAMPLE_OVERDUE_RECORDS);

  const handleSendReminder = (tenant: string, phone: string) => {
    toast.success(`Dunning notice dispatched to ${tenant} via WhatsApp & Email (${phone}).`);
  };

  const handleApplyLateFee = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, amount: r.amount + 500 } : r))
    );
    toast.info('Applied ₹500 standard late penalty to overdue balance.');
  };

  const handleExportCsv = () => {
    const lines = [
      ['Tenant', 'Invoice ID', 'Days Overdue', 'Amount (INR)', 'Contact', 'Phone'].join(','),
      ...records.map((r) => `"${r.tenant}","${r.invoiceId}","${r.daysOverdue}","${r.amount}","${r.contact}","${r.phone}"`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'superadmin_overdue_aging_report.csv';
    a.click();
    toast.success('Overdue aging report exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/60 to-[#0c0f2b] backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-indigo-400" size={20} />
            <h2 className="text-lg font-bold text-white tracking-tight">Outstanding Receivables & Revenue Reports</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <AlertTriangle size={11} /> Dunning Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Aging analysis of overdue subscription dues, automated dunning dispatch, and monthly/annual collection breakdowns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white text-xs font-semibold cursor-pointer"
          >
            <Download size={14} /> Export Aging CSV
          </button>
        </div>
      </div>

      {/* KPI Cards: Revenue & Aging Buckets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#06201a]/80 to-[#090d29]/95">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">November Collections</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">₹42,939</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-400" /> +14.2% MoM growth
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0e1338]/80 to-[#090d29]/95">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Annual FY26-27 Revenue</div>
          <div className="text-2xl font-extrabold text-indigo-300 font-mono">₹4,82,600</div>
          <div className="text-[10px] text-slate-400 mt-1">₹73,616 GST Collected (18%)</div>
        </div>

        <div className="p-4 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#241705]/80 to-[#090d29]/95">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">0-30 Days Overdue</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">₹14,750</div>
          <div className="text-[10px] text-slate-400 mt-1">2 Delinquent Libraries</div>
        </div>

        <div className="p-4 rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#220a14]/80 to-[#090d29]/95">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">31-60+ Days Overdue</div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">₹5,900</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 text-rose-300">
            <ShieldAlert size={12} /> Eligible for Suspension
          </div>
        </div>
      </div>

      {/* Overdue Delinquent Tenants Table */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#090d29]/95 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-indigo-500/20 bg-[#06081a]/95 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon size={16} className="text-rose-400" />
            <h3 className="text-sm font-bold text-white">Overdue Subscriptions & Automated Dunning Queue</h3>
          </div>
          <span className="text-xs text-slate-400">{records.length} Pending Collections</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-indigo-500/15 bg-[#060818] text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="p-3.5">Tenant Library</th>
                <th className="p-3.5">Invoice ID</th>
                <th className="p-3.5">Overdue Days</th>
                <th className="p-3.5 text-right">Outstanding Amount</th>
                <th className="p-3.5">Primary Contact</th>
                <th className="p-3.5 text-right">Dunning Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/10 text-slate-300">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-indigo-500/10 transition-colors">
                  <td className="p-3.5 font-bold text-slate-100">{r.tenant}</td>
                  <td className="p-3.5 font-mono text-indigo-300">{r.invoiceId}</td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      r.daysOverdue > 30
                        ? 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                        : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                    }`}>
                      <Clock size={10} /> {r.daysOverdue} Days
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-rose-400">₹{r.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3.5">
                    <div className="text-slate-200 font-medium">{r.contact}</div>
                    <div className="text-[10px] text-slate-500">{r.phone}</div>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSendReminder(r.tenant, r.phone)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 text-[11px] font-semibold cursor-pointer"
                      title="Dispatch WhatsApp Dunning Reminder"
                    >
                      <Send size={11} /> Remind
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyLateFee(r.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-[11px] font-semibold cursor-pointer"
                      title="Apply Late Fee Penalty"
                    >
                      +₹500 Fee
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
