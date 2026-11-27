'use client';

import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  CreditCard, Search, RotateCcw, Download, Printer, CheckCircle2,
  AlertTriangle, RefreshCw, ArrowUpRight, ShieldCheck, Zap
} from 'lucide-react';
import type { SuperadminPaymentTransaction } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
import { SUPERADMIN_BILLING_SAMPLE_TRANSACTIONS } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/mocks/fixtures/SuperadminBillingExpandedFixtures';

export default function SuperadminBillingTransactionsLedger() {
  const [transactions, setTransactions] = useState<SuperadminPaymentTransaction[]>(SUPERADMIN_BILLING_SAMPLE_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTxn, setSelectedTxn] = useState<SuperadminPaymentTransaction | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (methodFilter !== 'all' && t.method.toLowerCase() !== methodFilter.toLowerCase()) return false;
      if (statusFilter !== 'all' && t.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      const q = searchQuery.trim().toLowerCase();
      return !q || t.id.toLowerCase().includes(q) || t.invoiceId.toLowerCase().includes(q) || t.tenant.toLowerCase().includes(q) || t.utr.toLowerCase().includes(q);
    });
  }, [transactions, searchQuery, methodFilter, statusFilter]);

  const paginatedTransactions = useMemo(() => {
    return filtered.slice(page * pageSize, (page + 1) * pageSize);
  }, [filtered, page, pageSize]);

  const handleRetry = (txnId: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        id: `superadmin:billing_invoices:txn-retry:${txnId}`,
        loading: `Re-dispatching gateway webhook query for ${txnId}...`,
        success: `Payment gateway re-queried: ${txnId} status updated.`,
        error: 'Failed to reconnect with payment gateway.',
      }
    );
  };

  const handleExportCsv = () => {
    const lines = [
      ['Transaction ID', 'Invoice ID', 'Tenant', 'Date', 'Gross (INR)', 'Fee', 'Net (INR)', 'Method', 'Gateway', 'UTR', 'Status'].join(','),
      ...filtered.map((t) => `"${t.id}","${t.invoiceId}","${t.tenant}","${t.date}","${t.amount}","${t.fee}","${t.netAmount}","${t.method}","${t.gateway}","${t.utr}","${t.status}"`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'superadmin_payment_transactions_ledger.csv';
    a.click();
    toast.success('Transactions ledger exported to CSV', { id: 'superadmin:billing_invoices:txn-export' });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/60 to-[#0c0f2b] backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CreditCard className="text-indigo-400" size={20} />
            <h2 className="text-lg font-bold text-white tracking-tight">Real-Time Transactions & Payment History</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" /> Live Webhook Stream
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Audit-logged ledger of subscription collections, UPI intent receipts, card transactions, and gateway settlement payouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 text-xs font-semibold motion-safe:transition-all cursor-pointer"
          >
            <Download size={14} /> Export Ledger CSV
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl border border-indigo-500/20 bg-[#080b22]/90">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input maxLength={30}
            type="search"
            placeholder="Search by Transaction ID, Invoice ID, Tenant, UTR..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-indigo-500/20 bg-[#060818] text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
          />
        </div>
        <select
          value={methodFilter}
          onChange={(e) => { setMethodFilter(e.target.value); setPage(0); }}
          className="px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-[#060818] text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">All Methods</option>
          <option value="upi">UPI</option>
          <option value="card">Cards</option>
          <option value="netbanking">Net Banking</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-[#060818] text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        {(searchQuery || methodFilter !== 'all' || statusFilter !== 'all') && (
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setMethodFilter('all'); setStatusFilter('all'); setPage(0); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            title="Reset filters"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#090d29]/95 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-indigo-500/20 bg-[#06081a]/95 text-slate-300 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Tenant Library</th>
                <th className="p-3.5">Invoice ID</th>
                <th className="p-3.5">Method & Gateway</th>
                <th className="p-3.5">UTR / Reference</th>
                <th className="p-3.5 text-right">Gross Amount</th>
                <th className="p-3.5 text-right">Gateway Fee</th>
                <th className="p-3.5 text-right">Net Settled</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/10 text-slate-300">
              {paginatedTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-indigo-500/10 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-indigo-300">
                    {t.id}
                    <div className="text-[10px] text-slate-500 font-sans">{t.date}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-100">{t.tenant}</td>
                  <td className="p-3.5 font-mono text-slate-400">{t.invoiceId}</td>
                  <td className="p-3.5">
                    <span className="font-medium text-slate-200">{t.method}</span>
                    <span className="text-[10px] text-slate-500 block">{t.gateway}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">{t.utr}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">₹{t.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right font-mono text-slate-400">₹{t.fee.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-400">₹{t.netAmount.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      t.status === 'Success'
                        ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                        : t.status === 'Failed'
                        ? 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                        : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                    }`}>
                      {t.status === 'Success' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                      <span>{t.status}</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {t.status === 'Failed' ? (
                      <button
                        type="button"
                        onClick={() => handleRetry(t.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 text-[11px] font-semibold cursor-pointer"
                        title="Retry Gateway Sync"
                      >
                        <RefreshCw size={11} /> Retry
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toast.info(`Transaction ${t.id} settled via ${t.gateway}. Reference: ${t.utr}`, { id: `superadmin:billing_invoices:txn-info:${t.id}` })}
                        className="p-1 rounded-lg hover:bg-indigo-500/20 text-indigo-400"
                        title="View Audit Details"
                      >
                        <ArrowUpRight size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    No transactions match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <SuperadminTablePagination
          page={page}
          pageSize={pageSize}
          totalItems={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="transactions"
        />
      </div>
    </div>
  );
}
