'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import {
  CheckCircle, Download, AlertCircle, Search, X, RotateCcw,
  FileSpreadsheet, Printer, MessageSquare, Mail, PhoneCall, Plus, ShieldAlert, Eye
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
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  for (const field of ['id', 'uuid', 'recordId', 'tenant', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

export default function SuperadminBillingInvoicesPageClient() {
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  const locale = useLocale();
  const samplePdfLocaleSupported = locale.toLowerCase().startsWith('en');

  const [activeTab] = useState<'invoices'>('invoices');
  const [invoices, setInvoices] = useState<SuperadminBillingInvoiceSample[]>(() => [...SUPERADMIN_BILLING_SAMPLE_INVOICES]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const [selectedInvoice, setSelectedInvoice] = useState<SuperadminBillingInvoiceSample | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFailureRulesOpen, setIsFailureRulesOpen] = useState(false);

  const showToast = useCallback((msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_billing:SuperadminBillingInvoicesPageClient:feedback' });
  }, []);

  const handleOpenDetail = useCallback((inv: SuperadminBillingInvoiceSample) => {
    setSelectedInvoice(inv);
    setIsDetailOpen(true);
  }, []);

  const handleCreateInvoice = useCallback((newInv: SuperadminBillingInvoiceSample) => {
    setInvoices((prev) => [newInv, ...prev]);
    showToast(`Created Platform Tax Invoice ${newInv.id} for ${newInv.tenant}`);
  }, [showToast]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (methodFilter !== 'all' && inv.method.toLowerCase() !== methodFilter.toLowerCase()) return false;
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchesId = inv.id.toLowerCase().includes(q);
        const matchesTenant = inv.tenant.toLowerCase().includes(q);
        const matchesMethod = inv.method.toLowerCase().includes(q);
        const matchesContact = inv.contact ? inv.contact.toLowerCase().includes(q) : false;
        if (!matchesId && !matchesTenant && !matchesMethod && !matchesContact) return false;
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
      [tCopy('COPY.CSV_HEADER_INVOICE_ID'), tCopy('COPY.CSV_HEADER_TENANT'), tCopy('COPY.CSV_HEADER_DATE'), tCopy('COPY.CSV_HEADER_AMOUNT_INR'), tCopy('COPY.CSV_HEADER_STATUS'), tCopy('COPY.CSV_HEADER_METHOD'), tCopy('COPY.CSV_HEADER_GST')],
      ...filteredInvoices.map((r) => [r.id, r.tenant, r.date, r.amount, r.status, r.method, r.gst]),
    ];
    const blob = new Blob([lines.map((l) => l.map(escapeCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
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
        return (
          <span className={`sa-badge ${isPaid ? 'sa-badge--success' : 'sa-badge--danger'}`}>
            {isPaid ? <CheckCircle size={11} className="mr-1 inline" /> : <AlertCircle size={11} className="mr-1 inline" />}
            {isPaid ? tCopy('COPY.PAID') : val}
          </span>
        );
      },
    },
    { headerName: tCopy('COPY.TABLE_COLUMN_METHOD'), field: 'method', flex: 1, cellClass: () => 'sa-cell-muted' },
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
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-2 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 cursor-pointer"
              title="View Complete Tax Invoice"
            >
              <Eye size={12} />
              <span>Tax Invoice</span>
            </button>
            <button
              type="button"
              disabled={!params.data || !samplePdfLocaleSupported}
              title={!samplePdfLocaleSupported ? tCopy('COPY.SAMPLE_PDF_ENGLISH_ONLY') : undefined}
              className="sa-btn-ghost sa-btn-ghost--sm text-info border-border px-2 py-1 h-auto"
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
              <Download size={13} className="mr-1 inline" />
              {tCopy('COPY.SAMPLE_PDF')}
            </button>
          </div>
        );
      },
    },
  ], [tCopy, showToast, samplePdfLocaleSupported, handleOpenDetail]);

  return (
    <div className="sa-page-animate relative space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="sa-page-title">{tCopy('COPY.BILLING_REVENUE')}</h1>
          <p className="text-xs text-slate-400 mt-0.5">SaaS platform invoices, automated GST calculations, and payment failure handling.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsFailureRulesOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold cursor-pointer active:scale-95"
          >
            <ShieldAlert size={14} />
            <span>Failure & Safety Rules</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Invoice</span>
          </button>
          <button
            type="button"
            className="sa-btn-secondary inline-flex items-center gap-1.5"
            onClick={exportInvoicePreviewCsv}
            data-testid="superadmin-billing-billing-overview-export-csv-2"
          >
            <Download size={14} className="text-secondary" />
            <span>{tCopy('COPY.EXPORT_CSV')}</span>
          </button>
        </div>
      </div>

      <p className="rounded-xl border border-border bg-warning-bg p-3 text-xs text-warning" role="status">
        {tCopy('COPY.INVOICE_AND_PROMOTION_ENTRIES_ARE_LOCAL_DEMONSTRATION_DATA_PROMO_CHANGES_ARE_PREVIEWS_AND_ARE_NOT_LIVE_BILLING_CHANGES')}
      </p>

      {activeTab === 'invoices' && <SuperadminBillingInvoicesKpiCards />}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search invoice number, tenant, GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white placeholder:text-secondary focus:border-indigo-400 focus:outline-none"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary">
              <X size={12} />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 cursor-pointer"
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
          className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 cursor-pointer"
        >
          <option value="all">All Payment Methods</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="NetBanking">Net Banking</option>
        </select>

        {hasActiveFilters && (
          <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}

        <div className="ml-auto text-xs text-slate-400 font-medium px-2 py-1 rounded-md bg-surface border border-border">
          {filteredInvoices.length} of {invoices.length} Invoices
        </div>
      </div>

      <div className="sa-card p-0 overflow-hidden h-125 flex flex-col">
        {activeTab === 'invoices' && (
          <div className="flex-1 w-full">
            <SuperadminBillingInvoicesSemanticTable rowData={filteredInvoices} columnDefs={colDefs} headerHeight={48} rowHeight={64} suppressCellFocus pagination paginationPageSize={10} />
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

      <SuperadminPaymentFailureRulesModal
        isOpen={isFailureRulesOpen}
        onClose={() => setIsFailureRulesOpen(false)}
      />
    </div>
  );
}
