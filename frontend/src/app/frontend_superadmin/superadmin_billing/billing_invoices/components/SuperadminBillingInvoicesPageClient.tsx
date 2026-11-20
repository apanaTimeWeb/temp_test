'use client';

import { toast } from 'sonner';
/** Responsibility: renders the superadmin_billing overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminBillingInvoicesPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import type { SemanticCellParams as ICellRendererParams } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesSemanticTable';
import SuperadminBillingInvoicesSemanticTable from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesSemanticTable';

import { useState, useMemo, useCallback } from 'react';

import type { SemanticColumnDef as ColDef } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesSemanticTable';
import {
  CheckCircle, Download, AlertCircle, Search, X, RotateCcw,
  FileSpreadsheet, Printer, MessageSquare, Mail, PhoneCall
} from 'lucide-react';

import { SuperadminBillingDownloadSampleInvoicePdf } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesSamplePdf';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
import { SUPERADMIN_BILLING_SAMPLE_INVOICES } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/mocks/fixtures/SuperadminBillingInvoicesSampleMockFixtures';
import {
  downloadSuperadminInvoicesExcel,
  printSuperadminInvoicesRoster
} from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesExportUtils';
import SuperadminBillingInvoicesKpiCards from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesKpiCards';
import { useLocale, useTranslations } from 'next-intl';

/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

/**
 * Owns the invoice route view, sample invoice data, and local export previews.
 * The Promotions tab is navigation-only; promo management is owned by the canonical sibling route.
 */
export default function SuperadminBillingInvoicesPageClient() {
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  const locale = useLocale();
  const samplePdfLocaleSupported = locale.toLowerCase().startsWith('en');
  
  const [activeTab] = useState<'invoices'>("invoices");
  const [invoices] = useState<SuperadminBillingInvoiceSample[]>(SUPERADMIN_BILLING_SAMPLE_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const showToast = useCallback((msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_billing:SuperadminBillingInvoicesPageClient:feedback' });
  }, []);

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
    const escapeCell = (value: string | number) => `\"${String(value).replaceAll('\"', '\"\"')}\"`;
    const lines = [[tCopy('COPY.CSV_HEADER_INVOICE_ID'), tCopy('COPY.CSV_HEADER_TENANT'), tCopy('COPY.CSV_HEADER_DATE'), tCopy('COPY.CSV_HEADER_AMOUNT_INR'), tCopy('COPY.CSV_HEADER_STATUS'), tCopy('COPY.CSV_HEADER_METHOD'), tCopy('COPY.CSV_HEADER_GST')], ...filteredInvoices.map(row => [row.id, row.tenant, row.date, row.amount, row.status, row.method, row.gst])];
    const blob = new Blob([lines.map(line => line.map(escapeCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'superadmin_invoice_sample_preview.csv'; anchor.click();
    URL.revokeObjectURL(url);
    showToast(tCopy("COPY.SAMPLE_INVOICE_ROWS_EXPORTED_THIS_FILE_CONTAINS_ONLY_LOCAL_DEMONSTRATI_F7A809E7"));
  };

  const exportInvoicePreviewExcel = () => {
    downloadSuperadminInvoicesExcel(filteredInvoices, 'superadmin_invoices_statement.xls');
    showToast(`Exported ${filteredInvoices.length} invoice(s) to Excel (.xls)`);
  };

  const printInvoicesStatement = () => {
    printSuperadminInvoicesRoster(filteredInvoices, 'Invoices & Billing Statement');
    showToast(`Prepared ${filteredInvoices.length} invoice(s) for printing`);
  };

  const colDefs = useMemo<ColDef<SuperadminBillingInvoiceSample>[]>(() => [
    { headerName: tCopy("COPY.TABLE_COLUMN_INVOICE_ID"), field: 'id', flex: 1.2, cellClass: () => 'sa-cell-primary-bold' },
    { headerName: tCopy("COPY.TABLE_COLUMN_TENANT_LIBRARY"), field: 'tenant', flex: 1.5, cellClass: () => 'sa-cell-muted' },
    { headerName: tCopy("COPY.TABLE_COLUMN_DATE"), field: 'date', flex: 1, cellClass: () => 'sa-cell-muted-sm' },
    { headerName: tCopy("COPY.TABLE_COLUMN_AMOUNT"), field: 'amount', flex: 1,
      cellRenderer: (p: ICellRendererParams) => <span className="text-sm font-bold text-success">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</span>
    },
    { headerName: tCopy("COPY.TABLE_COLUMN_STATUS"), field: 'status', flex: 1,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`sa-badge ${p.value === 'Paid' ? 'sa-badge--success' : 'sa-badge--danger'}`}>
          {p.value === 'Paid' ? <CheckCircle size={11} className="mr-1 inline" /> : <AlertCircle size={11} className="mr-1 inline" />} {p.value === 'Paid' ? tCopy('COPY.PAID') : tCopy('COPY.OVERDUE')}
        </span>
      ),
    },
    { headerName: tCopy("COPY.TABLE_COLUMN_METHOD"), field: 'method', flex: 1, cellClass: () => 'sa-cell-muted' },
    { headerName: tCopy("COPY.TABLE_COLUMN_ACTION"), flex: 1.8, minWidth: 230,
      cellRenderer: (params: ICellRendererParams<SuperadminBillingInvoiceSample>) => {
        if (!params.data) return null;
        const inv = params.data;
        const testIdSuffix = getSuperadminInteractiveTestIdSuffix(params.data);
        const rawPhone = inv.phone || '9876543210';
        let digits = rawPhone.replace(/\D/g, '');
        if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
        const waPhone = digits.length === 10 ? `91${digits}` : digits;
        const waMsg = `Hello ${inv.contact || inv.tenant}, sending details for Invoice ${inv.id} (Amount: Rs. ${inv.amount.toLocaleString('en-IN')}, Status: ${inv.status}) from Smart Library SuperAdmin.`;

        return (
          <div className="flex items-center gap-1.5 flex-wrap">
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
                  showToast(tCopy("COPY.DOWNLOADED_A_SAMPLE_ONLY_PDF_PREVIEW_IT_IS_NOT_A_LIVE_INVOICE_OR_TAX_DOCUMENT"));
                } catch {
                  showToast(tCopy("COPY.PDF_PREVIEW_DOWNLOAD_FAILED_NO_INVOICE_DATA_WAS_CHANGED"));
                }
              }}
              data-testid={`superadmin-billing-billing-overview-download-sample-pdf-for-invoice-1-${testIdSuffix}`}
            >
              <Download size={14} className="mr-1 inline" aria-hidden="true" />
              {tCopy("COPY.SAMPLE_PDF")}
            </button>

            {/* Quick WhatsApp */}
            <button
              type="button"
              onClick={() => {
                const popup = window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`, '_blank', 'noopener,noreferrer');
                if (popup) popup.opener = null;
                showToast(`Sent invoice WhatsApp link for ${inv.tenant}`);
              }}
              className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs cursor-pointer"
              title={`Send invoice via WhatsApp to ${inv.tenant}`}
              aria-label={`WhatsApp invoice ${inv.id}`}
            >
              <MessageSquare size={13} className="text-emerald-400" />
            </button>

            {/* Quick Email */}
            {inv.email && (
              <a
                href={`mailto:${inv.email}?subject=${encodeURIComponent(`Smart Library Invoice ${inv.id} - ${inv.tenant}`)}&body=${encodeURIComponent(`Dear ${inv.contact || inv.tenant},\n\nPlease find details for your Smart Library invoice ${inv.id}.\nAmount: Rs. ${inv.amount}\nStatus: ${inv.status}\n\nThank you,\nSuperAdmin Finance Team`)}`}
                className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:text-white hover:bg-purple-600/30 transition-all shadow-xs cursor-pointer"
                title={`Email invoice to ${inv.tenant}`}
                aria-label={`Email invoice ${inv.id}`}
              >
                <Mail size={13} className="text-purple-400" />
              </a>
            )}

            {/* Quick Call */}
            {inv.phone && (
              <a
                href={`tel:${inv.phone.replace(/\D/g, '')}`}
                className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-500/15 text-teal-300 hover:text-white hover:bg-teal-600/30 transition-all shadow-xs cursor-pointer"
                title={`Call ${inv.tenant}`}
                aria-label={`Call tenant for invoice ${inv.id}`}
              >
                <PhoneCall size={13} className="text-teal-400" />
              </a>
            )}
          </div>
        );
      }
    },
  ], [tCopy, showToast, samplePdfLocaleSupported]);

  return (
    <div className="sa-page-animate relative">

      <div className="flex flex-col gap-1 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2">
          <h1 className="sa-page-title">{tCopy("COPY.BILLING_REVENUE")}</h1>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              className="sa-btn-secondary inline-flex items-center gap-1.5"
              onClick={exportInvoicePreviewCsv}
              data-testid="superadmin-billing-billing-overview-export-csv-2"
              title="Export CSV"
            >
              <Download size={14} className="text-secondary" />
              <span>{tCopy("COPY.EXPORT_CSV")}</span>
            </button>
            <button
              type="button"
              className="sa-btn-secondary inline-flex items-center gap-1.5"
              onClick={exportInvoicePreviewExcel}
              title="Export Excel (.xls)"
            >
              <FileSpreadsheet size={14} className="text-indigo-400" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              className="sa-btn-secondary inline-flex items-center gap-1.5"
              onClick={printInvoicesStatement}
              title="Print Invoices Statement"
            >
              <Printer size={14} className="text-sky-400" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.INVOICE_AND_PROMOTION_ENTRIES_ARE_LOCAL_DEMONSTRATION_DATA_PROMO_CHANGES_ARE_PREVIEWS_AND_ARE_NOT_LIVE_BILLING_CHANGES")}</p>

      {activeTab === 'invoices' && <SuperadminBillingInvoicesKpiCards />}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search by invoice ID, tenant, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white placeholder:text-secondary focus:border-indigo-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors cursor-pointer p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <select
          aria-label="Filter by invoice status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:outline-none shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          aria-label="Filter by payment method"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:outline-none shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Payment Methods</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/35 transition-all cursor-pointer"
            title="Reset active filters"
          >
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
          <div className="flex-1 w-full motion-safe:animate-fade-in motion-reduce:animate-none">
            <SuperadminBillingInvoicesSemanticTable rowData={filteredInvoices} columnDefs={colDefs} headerHeight={48} rowHeight={64} suppressCellFocus pagination paginationPageSize={10} />
          </div>
        )}
      </div>
    </div>
  );
}
