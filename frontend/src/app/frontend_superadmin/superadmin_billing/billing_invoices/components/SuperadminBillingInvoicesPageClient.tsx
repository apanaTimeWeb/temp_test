'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import {
  CheckCircle, Download, AlertCircle, Search, X, RotateCcw,
  FileSpreadsheet, Printer, MessageSquare, Mail, PhoneCall, Plus, ShieldAlert, Eye, Receipt
} from 'lucide-react';
import type { SemanticColumnDef as ColDef, SemanticCellParams as ICellRendererParams } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesSemanticTable';
import SuperadminBillingInvoicesSemanticTable from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesSemanticTable';
import { SuperadminBillingDownloadSampleInvoicePdf } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesSamplePdf';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
import { SUPERADMIN_BILLING_SAMPLE_INVOICES } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/mocks/fixtures/SuperadminBillingInvoicesSampleMockFixtures';
import { downloadSuperadminInvoicesExcel, printSuperadminInvoicesRoster } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesExportUtils';
import SuperadminBillingInvoicesKpiCards from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesKpiCards';
import SuperadminBillingCreateInvoiceModal from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingCreateInvoiceModal';
import SuperadminBillingInvoiceDetailModal from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoiceDetailModal';
import SuperadminPaymentFailureRulesModal from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminPaymentFailureRulesModal';

function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const found = ['id', 'uuid', 'recordId', 'tenant', 'name'].find((f) => typeof record[f] === 'string' || typeof record[f] === 'number');
  return found ? String(record[found]) : 'missing-domain-id';
}

export default function SuperadminBillingInvoicesPageClient({ initialFilter }: { initialFilter?: string } = {}) {
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  const locale = useLocale();
  const samplePdfLocaleSupported = locale.toLowerCase().startsWith('en');

  const [activeTab] = useState<'invoices'>('invoices');
  const [invoices, setInvoices] = useState<SuperadminBillingInvoiceSample[]>(() => [...SUPERADMIN_BILLING_SAMPLE_INVOICES]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter === 'outstanding' ? 'Overdue' : 'all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<SuperadminBillingInvoiceSample | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFailureRulesOpen, setIsFailureRulesOpen] = useState(false);

  const showToast = useCallback((msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_billing:SuperadminBillingInvoicesPageClient:feedback' }); }, []);
  const handleOpenDetail = useCallback((inv: SuperadminBillingInvoiceSample) => { setSelectedInvoice(inv); setIsDetailOpen(true); }, []);
  const handleCreateInvoice = useCallback((newInv: SuperadminBillingInvoiceSample) => { setInvoices((prev) => [newInv, ...prev]); showToast(`Created Platform Tax Invoice ${newInv.id} for ${newInv.tenant}`); }, [showToast]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (methodFilter !== 'all' && inv.method.toLowerCase() !== methodFilter.toLowerCase()) return false;
      const q = searchQuery.trim().toLowerCase();
      return !q || inv.id.toLowerCase().includes(q) || inv.tenant.toLowerCase().includes(q) || inv.method.toLowerCase().includes(q) || (inv.contact ? inv.contact.toLowerCase().includes(q) : false);
    });
  }, [invoices, searchQuery, statusFilter, methodFilter]);

  const hasActiveFilters = Boolean(searchQuery || statusFilter !== 'all' || methodFilter !== 'all');
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setMethodFilter('all');
  };

  const exportInvoicePreviewCsv = () => {
    const lines = [
      [tCopy('COPY.CSV_HEADER_INVOICE_ID'), tCopy('COPY.CSV_HEADER_TENANT'), tCopy('COPY.CSV_HEADER_DATE'), tCopy('COPY.CSV_HEADER_AMOUNT_INR'), tCopy('COPY.CSV_HEADER_STATUS'), tCopy('COPY.CSV_HEADER_METHOD'), tCopy('COPY.CSV_HEADER_GST')].join(','),
      ...filteredInvoices.map((r) => `"${r.id}","${r.tenant}","${r.date}","${r.amount}","${r.status}","${r.method}","${r.gst}"`),
    ];
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
    anchor.download = 'superadmin_invoice_sample_preview.csv';
    anchor.click();
    showToast(tCopy('COPY.SAMPLE_INVOICE_ROWS_EXPORTED_THIS_FILE_CONTAINS_ONLY_LOCAL_DEMONSTRATI_F7A809E7'));
  };

  const colDefs = useMemo<ColDef<SuperadminBillingInvoiceSample>[]>(() => [
    { headerName: tCopy('COPY.TABLE_COLUMN_INVOICE_ID'), field: 'id', flex: 1.2, cellClass: () => 'sa-cell-primary-bold' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_TENANT_LIBRARY'),
      field: 'tenant',
      flex: 1.6,
      cellRenderer: (p: ICellRendererParams<SuperadminBillingInvoiceSample>) => (
        <div>
          <span className="font-semibold text-slate-100">{p.data?.tenant}</span>
          {p.data?.legalName && <div className="text-[10px] text-slate-400 truncate">{p.data.legalName}</div>}
        </div>
      ),
    },
    { headerName: tCopy('COPY.TABLE_COLUMN_DATE'), field: 'date', flex: 1, cellClass: () => 'sa-cell-muted-sm' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_AMOUNT'),
      field: 'amount',
      flex: 1.1,
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
      cellRenderer: (p: ICellRendererParams<SuperadminBillingInvoiceSample>) => {
        const val = String(p.value ?? '');
        const isPaid = val === 'Paid';
        const isOverdue = val === 'Overdue' || val === 'Failed';
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              isPaid
                ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                : isOverdue
                ? 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
            }`}
          >
            {isPaid ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
            <span>{isPaid ? tCopy('COPY.PAID') : val}</span>
          </span>
        );
      },
    },
    { headerName: tCopy('COPY.TABLE_COLUMN_METHOD'), field: 'method', flex: 1, cellClass: () => 'sa-cell-muted font-mono text-xs' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_ACTION'),
      flex: 2,
      minWidth: 260,
      cellRenderer: (params: ICellRendererParams<SuperadminBillingInvoiceSample>) => {
        if (!params.data) return null;
        const inv = params.data;
        const testIdSuffix = getSuperadminInteractiveTestIdSuffix(params.data);
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleOpenDetail(inv)}
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/15 hover:bg-indigo-500/25 px-2.5 py-1 text-xs font-semibold text-indigo-300 transition-all cursor-pointer active:scale-95"
              title="View Complete Tax Invoice"
            >
              <Eye size={12} />
              <span>Tax Invoice</span>
            </button>
            <button
              type="button"
              disabled={!params.data || !samplePdfLocaleSupported}
              title={!samplePdfLocaleSupported ? tCopy('COPY.SAMPLE_PDF_ENGLISH_ONLY') : undefined}
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2.5 py-1 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
              aria-label={!samplePdfLocaleSupported ? tCopy('COPY.SAMPLE_PDF_ENGLISH_ONLY') : params.data ? tCopy('COPY.DOWNLOAD_SAMPLE_PDF_FOR_INVOICE', { id: params.data.id }) : tCopy('COPY.INVOICE_ROW_UNAVAILABLE')}
              onClick={() => {
                if (!params.data) return;
                try {
                  SuperadminBillingDownloadSampleInvoicePdf(params.data);
                  showToast(tCopy('COPY.DOWNLOADED_A_SAMPLE_ONLY_PDF_PREVIEW_IT_IS_NOT_A_LIVE_INVOICE_OR_TAX_DOCUMENT'));
                } catch {
                  showToast(tCopy('COPY.PDF_PREVIEW_DOWNLOAD_FAILED_NO_INVOICE_DATA_WAS_CHANGED'));
                }
              }}
              data-testid={`superadmin-billing-billing-overview-download-sample-pdf-for-invoice-1-${testIdSuffix}`}
            >
              <Download size={12} />
              <span>{tCopy('COPY.SAMPLE_PDF')}</span>
            </button>
          </div>
        );
      },
    },
  ], [tCopy, showToast, samplePdfLocaleSupported, handleOpenDetail]);

  return (
    <div className="sa-page-animate relative space-y-6">
      {/* Notice Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300 backdrop-blur-md" role="status">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
        <p className="min-w-0 flex-1 leading-relaxed">
          {tCopy('COPY.INVOICE_AND_PROMOTION_ENTRIES_ARE_LOCAL_DEMONSTRATION_DATA_PROMO_CHANGES_ARE_PREVIEWS_AND_ARE_NOT_LIVE_BILLING_CHANGES')}
        </p>
      </div>

      {/* Cyber Hero Header */}
      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/80 via-[#0a0d24] to-[#060810] p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
                <Receipt size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                {tCopy('COPY.BILLING_REVENUE')}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                GST Auto-Settlement Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              SaaS platform tax invoices, automated recurring payments, GST compliance breakdown, and payment failure dunning.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsFailureRulesOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              <ShieldAlert size={14} />
              <span>Failure & Safety Rules</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/25 active:scale-95 cursor-pointer transition-all"
            >
              <Plus size={15} />
              <span>Create Invoice</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-[#07091a]/80 hover:bg-indigo-950/40 text-slate-200 text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              onClick={exportInvoicePreviewCsv}
              data-testid="superadmin-billing-billing-overview-export-csv-2"
            >
              <Download size={14} className="text-indigo-400" />
              <span>{tCopy('COPY.EXPORT_CSV')}</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'invoices' && <SuperadminBillingInvoicesKpiCards />}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0c0f2b] via-[#090b20] to-[#060818] shadow-md flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search invoice number, tenant, GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-indigo-500/30 bg-[#07091a]/85 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
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
          className="rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-indigo-400 focus:outline-none cursor-pointer"
        >
          <option value="all">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Refunded">Refunded</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-indigo-400 focus:outline-none cursor-pointer"
        >
          <option value="all">All Payment Methods</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="NetBanking">Net Banking</option>
        </select>

        {hasActiveFilters && (
          <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 cursor-pointer active:scale-95 transition-all">
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}

        <div className="ml-auto text-xs text-indigo-300 font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          {filteredInvoices.length} of {invoices.length} Invoices
        </div>
      </div>

      {/* Main Semantic Table */}
      <div className="overflow-hidden">
        {activeTab === 'invoices' && (
          <div className="w-full">
            <SuperadminBillingInvoicesSemanticTable
              rowData={filteredInvoices}
              columnDefs={colDefs}
              pagination
              paginationPageSize={10}
            />
          </div>
        )}
      </div>

      <SuperadminBillingCreateInvoiceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateInvoice}
        nextInvoiceSequence={invoices.length + 1}
      />
      <SuperadminBillingInvoiceDetailModal
        invoice={selectedInvoice}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSendEmail={(inv) => showToast(`Dispatched tax invoice PDF to ${inv.email || inv.tenant}`)}
        onSendWhatsApp={(inv) => showToast(`Generated WhatsApp invoice link for ${inv.tenant}`)}
      />
      <SuperadminPaymentFailureRulesModal isOpen={isFailureRulesOpen} onClose={() => setIsFailureRulesOpen(false)} />
    </div>
  );
}
