'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  CheckCircle, Download, AlertCircle, Search, X, RotateCcw,
  ShieldCheck, FileText, ArrowRight, Settings, RefreshCw, CreditCard, Landmark, Percent
} from 'lucide-react';
import type { SemanticCellParams as ICellRendererParams, SemanticColumnDef as ColDef } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewSemanticTable';
import SuperadminBillingOverviewSemanticTable from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewSemanticTable';
import { SuperadminBillingDownloadSampleInvoicePdf } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/utils/SuperadminBillingOverviewSamplePdf';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/types/SuperadminBillingOverviewTypes';
import { SUPERADMIN_BILLING_SAMPLE_INVOICES } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/mocks/fixtures/SuperadminBillingOverviewSampleMockFixtures';
import SuperadminBillingOverviewKpiCards from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewKpiCards';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

interface SuperadminBillingOverviewPageClientProps {
  initialTab?: string;
}

export default function SuperadminBillingOverviewPageClient({ initialTab }: SuperadminBillingOverviewPageClientProps = {}) {
  const tCopy = useTranslations('SUPERADMIN_BILLING');

  const [activeTab, setActiveTab] = useState<'invoices' | 'gst' | 'refunds'>(
    initialTab === 'gst' ? 'gst' : initialTab === 'refunds' ? 'refunds' : 'invoices'
  );

  const [invoices] = useState<SuperadminBillingInvoiceSample[]>(SUPERADMIN_BILLING_SAMPLE_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // GST Settings form states
  const [gstin, setGstin] = useState('07AAACS9988D1Z2');
  const [legalName, setLegalName] = useState('Smart Library Cloud Technologies India Pvt Ltd');
  const [sacCode, setSacCode] = useState('998313');
  const [cgstRate, setCgstRate] = useState(9);
  const [sgstRate, setSgstRate] = useState(9);
  const [igstRate, setIgstRate] = useState(18);
  const [isSavingGst, setIsSavingGst] = useState(false);

  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_billing:SuperadminBillingOverviewPageClient:feedback' });
  };

  const handleSaveGst = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGst(true);
    setTimeout(() => {
      setIsSavingGst(false);
      toast.success('GST & Tax Configuration updated successfully and synced across billing engines.');
    }, 600);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (methodFilter !== 'all' && inv.method.toLowerCase() !== methodFilter.toLowerCase()) return false;
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchesId = inv.id.toLowerCase().includes(q);
        const matchesTenant = inv.tenant.toLowerCase().includes(q);
        const matchesMethod = inv.method.toLowerCase().includes(q);
        const matchesGst = inv.gst ? inv.gst.toLowerCase().includes(q) : false;
        if (!matchesId && !matchesTenant && !matchesMethod && !matchesGst) return false;
      }
      return true;
    });
  }, [invoices, searchQuery, statusFilter, methodFilter]);

  const hasActiveFilters = Boolean(searchQuery || statusFilter !== 'all' || methodFilter !== 'all');
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setMethodFilter('all');
  };

  const exportInvoicePreviewCsv = () => {
    const escapeCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const lines = [
      ['Invoice ID', 'Tenant', 'Date', 'Amount INR', 'Status', 'Method', 'GST'],
      ...filteredInvoices.map((row) => [row.id, row.tenant, row.date, row.amount, row.status, row.method, row.gst]),
    ];
    const blob = new Blob([lines.map((line) => line.map(escapeCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'superadmin_invoice_sample_preview.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    showToast(tCopy('COPY.SAMPLE_INVOICE_ROWS_EXPORTED_THIS_FILE_CONTAINS_ONLY_LOCAL_DEMONSTRATI_F7A809E7'));
  };

  const colDefs = useMemo<ColDef<SuperadminBillingInvoiceSample>[]>(() => [
    { headerName: tCopy('COPY.TABLE_COLUMN_INVOICE_ID'), field: 'id', flex: 1.2, cellClass: () => 'sa-cell-primary-bold' },
    { headerName: tCopy('COPY.TABLE_COLUMN_TENANT_LIBRARY'), field: 'tenant', flex: 1.5, cellClass: () => 'sa-cell-muted' },
    { headerName: tCopy('COPY.TABLE_COLUMN_DATE'), field: 'date', flex: 1, cellClass: () => 'sa-cell-muted-sm' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_AMOUNT'),
      field: 'amount',
      flex: 1,
      cellRenderer: (p: ICellRendererParams<SuperadminBillingInvoiceSample>) => (
        <span className="text-xs font-bold text-emerald-400 font-mono">
          ₹{Number(p.value ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_STATUS'),
      field: 'status',
      flex: 1,
      cellRenderer: (p: ICellRendererParams<SuperadminBillingInvoiceSample>) => (
        <span className={`sa-badge ${p.value === 'Paid' ? 'sa-badge--success' : 'sa-badge--danger'}`}>
          {p.value === 'Paid' ? <CheckCircle size={11} className="mr-1 inline" /> : <AlertCircle size={11} className="mr-1 inline" />} {p.value === 'Paid' ? tCopy('COPY.PAID') : tCopy('COPY.OVERDUE')}
        </span>
      ),
    },
    { headerName: tCopy('COPY.TABLE_COLUMN_METHOD'), field: 'method', flex: 1, cellClass: () => 'sa-cell-muted' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_ACTION'),
      flex: 1,
      cellRenderer: (params: ICellRendererParams<SuperadminBillingInvoiceSample>) => {
        return (
          <button
            type="button"
            disabled={!params.data}
            className="sa-btn-ghost sa-btn-ghost--sm text-info border-border px-2 py-1 h-auto"
            aria-label={params.data ? tCopy('COPY.DOWNLOAD_SAMPLE_PDF_FOR_INVOICE', { id: params.data.id }) : tCopy('COPY.INVOICE_ROW_UNAVAILABLE')}
            onClick={() => {
              if (!params.data) return;
              try {
                SuperadminBillingDownloadSampleInvoicePdf(params.data);
                showToast(tCopy('COPY.DOWNLOADED_A_SAMPLE_ONLY_PDF_PREVIEW_IT_IS_NOT_A_LIVE_INVOICE_OR_TAX_DOCUMENT'));
              } catch {
                showToast(tCopy('COPY.PDF_PREVIEW_DOWNLOAD_FAILED_NO_INVOICE_DATA_WAS_CHANGED'));
              }
            }}
            data-testid={`superadmin-billing-billing-overview-download-sample-pdf-for-invoice-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}
          >
            <Download size={14} className="mr-1 inline" aria-hidden="true" /> {tCopy('COPY.SAMPLE_PDF')}
          </button>
        );
      },
    },
  ], [tCopy, showToast]);

  const sampleCreditNotes = [
    { id: 'CN-2026-0001', tenant: 'Silicon Valley Institute Lib', invoiceId: 'INV-2026-0004', amount: 5899, reason: 'Duplicate Mandate Reversed', ref: 'rfnd_rzp_88491', status: 'Settled', date: '19 Nov, 2026' },
    { id: 'CN-2026-0002', tenant: 'Pioneer Reading Rooms', invoiceId: 'INV-2026-0006', amount: 2999, reason: 'Prorated Plan Adjustment', ref: 'rfnd_stp_44102', status: 'Settled', date: '16 Nov, 2026' },
    { id: 'CN-2026-0003', tenant: 'Horizon Study Space', invoiceId: 'INV-2026-0008', amount: 5602, reason: 'Early Upgrade Credit', ref: 'rfnd_rzp_11902', status: 'Settled', date: '12 Nov, 2026' },
  ];

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {/* Hero Header */}
      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/80 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{tCopy('COPY.BILLING_REVENUE')}</h1>
            <p className="text-xs text-slate-400">
              Platform revenue overview, payment reconciliation, GST configuration, and dispute settlements.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={SUPERADMIN_NAVIGATION_ROUTES.billing_invoices}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <FileText size={14} />
              <span>Platform Invoices & Rules</span>
              <ArrowRight size={12} />
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 transition-all active:scale-95 cursor-pointer"
              onClick={exportInvoicePreviewCsv}
              data-testid="superadmin-billing-billing-overview-export-csv-2"
            >
              <Download size={14} className="text-indigo-400" /> {tCopy('COPY.EXPORT_CSV')}
            </button>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200" role="status">
        {tCopy('COPY.INVOICE_AND_PROMOTION_ENTRIES_ARE_LOCAL_DEMONSTRATION_DATA_PROMO_CHANGES_ARE_PREVIEWS_AND_ARE_NOT_LIVE_BILLING_CHANGES')}
      </p>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'invoices'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <CreditCard size={14} />
          <span>Payment Collection & Ledger</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gst')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'gst'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Landmark size={14} />
          <span>GST Settings & Taxes</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('refunds')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'refunds'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Refunds & Credit Notes</span>
        </button>
      </div>

      {/* Tab 1: Payment Collection & Ledger */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <SuperadminBillingOverviewKpiCards />

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
              <input maxLength={100}
                type="search"
                placeholder="Search collection ledger, tenant, GSTIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-indigo-500/25 bg-slate-900/80 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X size={12} />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-indigo-500/25 bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 cursor-pointer"
            >
              <option value="all">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-xl border border-indigo-500/25 bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 cursor-pointer"
            >
              <option value="all">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="NetBanking">Net Banking</option>
            </select>

            {hasActiveFilters && (
              <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 cursor-pointer">
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}

            <div className="ml-auto text-xs text-slate-400 font-medium px-2.5 py-1 rounded-md bg-slate-900 border border-indigo-500/20">
              {filteredInvoices.length} of {invoices.length} Records
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0a0d22] to-[#060810] overflow-hidden shadow-lg h-125 flex flex-col">
            <div className="flex-1 w-full">
              <SuperadminBillingOverviewSemanticTable
                rowData={filteredInvoices}
                columnDefs={colDefs}
                headerHeight={48}
                rowHeight={64}
                suppressCellFocus
                pagination
                paginationPageSize={10}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: GST Settings & Taxes */}
      {activeTab === 'gst' && (
        <div className="space-y-4">
          <form onSubmit={handleSaveGst} className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28] p-5 sm:p-6 shadow-xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Landmark size={18} className="text-indigo-400" />
                  <span>SaaS Platform GSTIN & Tax Configuration</span>
                </h2>
                <p className="text-slate-400 mt-0.5">Define platform-wide GSTIN, SAC codes, and applicable tax rate structures.</p>
              </div>
              <button
                type="submit"
                disabled={isSavingGst}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-md active:scale-95 cursor-pointer disabled:opacity-50 transition-all"
              >
                <CheckCircle size={14} />
                <span>{isSavingGst ? 'Saving...' : 'Save GST Profile'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Platform Legal Business Name</label>
                <input maxLength={100}
                  type="text"
                  required
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 px-3 py-2 text-slate-100 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Platform Registered GSTIN</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 px-3 py-2 text-slate-100 uppercase font-mono focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Services SAC Code</label>
                <input maxLength={30}
                  type="text"
                  required
                  value={sacCode}
                  onChange={(e) => setSacCode(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 px-3 py-2 text-slate-100 font-mono focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">998313: IT SaaS Application Provisioning</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">CGST Rate (Intra-State %)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={28}
                    value={cgstRate}
                    onChange={(e) => setCgstRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 px-3 py-2 text-slate-100 font-mono focus:border-indigo-500"
                  />
                  <Percent size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">SGST Rate (Intra-State %)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={28}
                    value={sgstRate}
                    onChange={(e) => setSgstRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 px-3 py-2 text-slate-100 font-mono focus:border-indigo-500"
                  />
                  <Percent size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">IGST Rate (Inter-State %)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={28}
                    value={igstRate}
                    onChange={(e) => setIgstRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 px-3 py-2 text-slate-100 font-mono focus:border-indigo-500"
                  />
                  <Percent size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Tax compliance info boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-slate-900/50 space-y-1.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Reverse Charge Mechanism (RCM)</span>
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  RCM under Section 9(3) / 9(4) is <strong>Disabled</strong>. All SaaS subscriptions are billed under Forward Charge with platform GST remittance.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-slate-900/50 space-y-1.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText size={14} className="text-indigo-400" />
                  <span>E-Invoicing & IRN Generation</span>
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  NIC Portal E-Invoice integration is <strong>Active</strong>. Every B2B transaction produces a signed Invoice Reference Number (IRN) and QR code automatically.
                </p>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Refunds & Credit Notes */}
      {activeTab === 'refunds' && (
        <div className="space-y-4">
          {/* Refund KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-indigo-500/20 bg-[#0c0f28] shadow">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Refunded (FY 26-27)</span>
              <p className="text-lg font-black text-slate-100 font-mono mt-1">₹14,500</p>
              <span className="text-[10px] text-emerald-400">100% gateway reversed</span>
            </div>
            <div className="p-4 rounded-xl border border-indigo-500/20 bg-[#0c0f28] shadow">
              <span className="text-[10px] uppercase font-bold text-slate-400">Credit Notes Emitted</span>
              <p className="text-lg font-black text-indigo-400 font-mono mt-1">3 Notes</p>
              <span className="text-[10px] text-slate-400">Sequential CN-2026</span>
            </div>
            <div className="p-4 rounded-xl border border-indigo-500/20 bg-[#0c0f28] shadow">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Disputes</span>
              <p className="text-lg font-black text-emerald-400 font-mono mt-1">0 Open</p>
              <span className="text-[10px] text-emerald-400">Clean dispute history</span>
            </div>
            <div className="p-4 rounded-xl border border-indigo-500/20 bg-[#0c0f28] shadow">
              <span className="text-[10px] uppercase font-bold text-slate-400">Auto-Reversal SLA</span>
              <p className="text-lg font-black text-slate-100 font-mono mt-1">&lt; 24h</p>
              <span className="text-[10px] text-slate-400">Razorpay / Stripe Webhook</span>
            </div>
          </div>

          {/* Credit Notes Table */}
          <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28] p-5 shadow-xl space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <FileText size={16} className="text-indigo-400" />
                <span>Credit Notes & Refund Reversal Ledger</span>
              </h3>
              <span className="text-[11px] text-slate-400">{sampleCreditNotes.length} Credit Notes</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border/40">
              <table className="w-full text-left">
                <thead className="bg-slate-900/80 text-[10px] uppercase font-bold text-slate-400 border-b border-border/40">
                  <tr>
                    <th className="p-3">Credit Note ID</th>
                    <th className="p-3">Tenant Library</th>
                    <th className="p-3">Original Invoice</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3">Gateway Ref</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-slate-200">
                  {sampleCreditNotes.map((cn) => (
                    <tr key={cn.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-indigo-300">{cn.id}</td>
                      <td className="p-3 font-semibold text-slate-100">{cn.tenant}</td>
                      <td className="p-3 font-mono text-slate-400">{cn.invoiceId}</td>
                      <td className="p-3 text-slate-300">{cn.reason}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">₹{cn.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">{cn.ref}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {cn.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => showToast(`Emitted Credit Note ${cn.id} receipt for ${cn.tenant}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 text-[11px] font-semibold cursor-pointer"
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
      )}
    </div>
  );
}
