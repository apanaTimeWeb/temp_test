'use client';

import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/config/superadmin_billing_overview.url_config.ts';

import { toast } from 'sonner';
/** Responsibility: renders the superadmin_billing overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminBillingOverviewPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import type { SemanticCellParams as ICellRendererParams } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewSemanticTable';
import SuperadminBillingOverviewSemanticTable from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewSemanticTable';


import { useState, useMemo } from 'react';



import type { SemanticColumnDef as ColDef } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewSemanticTable';
import { CheckCircle, Download, AlertCircle } from 'lucide-react';

import { SuperadminBillingDownloadSampleInvoicePdf } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/utils/SuperadminBillingOverviewSamplePdf';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/types/SuperadminBillingOverviewTypes';
import { SUPERADMIN_BILLING_SAMPLE_INVOICES } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/mocks/fixtures/SuperadminBillingOverviewSampleMockFixtures';
import SuperadminBillingOverviewKpiCards from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewKpiCards';
import { useTranslations } from 'next-intl';

import { SUPERADMIN_BILLING_TABS } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/constants/SuperadminBillingOverviewConstants';


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
export default function SuperadminBillingOverviewPageClient() {
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  
  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
    "invoices": SUPERADMIN_NAVIGATION_ROUTES.billing_invoices,
    "promos": SUPERADMIN_NAVIGATION_ROUTES.plans_promotions
    };
    const route = routes[key];
    if (route) { const target = new URL(route, window.location.origin); const query = new URLSearchParams(window.location.search); query.delete('view'); query.forEach((value, key) => { if (!target.searchParams.has(key)) target.searchParams.append(key, value); }); window.location.assign(target.pathname + target.search + target.hash); }
  };
  const [activeTab] = useState<'invoices' | 'promos'>('invoices');
  const [invoices] = useState<SuperadminBillingInvoiceSample[]>(SUPERADMIN_BILLING_SAMPLE_INVOICES);

  const showToast = (msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_billing:SuperadminBillingOverviewPageClient:feedback' }); };

  const exportInvoicePreviewCsv = () => {
    const escapeCell = (value: string | number) => `\"${String(value).replaceAll('\"', '\"\"')}\"`;
    const lines = [['Invoice ID', 'Tenant', 'Date', 'Amount INR', 'Status', 'Method', 'GST'], ...invoices.map(row => [row.id, row.tenant, row.date, row.amount, row.status, row.method, row.gst])];
    const blob = new Blob([lines.map(line => line.map(escapeCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'superadmin_invoice_sample_preview.csv'; anchor.click();
    URL.revokeObjectURL(url);
    showToast(tCopy("COPY.SAMPLE_INVOICE_ROWS_EXPORTED_THIS_FILE_CONTAINS_ONLY_LOCAL_DEMONSTRATI_F7A809E7"));
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
    { headerName: tCopy("COPY.TABLE_COLUMN_ACTION"), flex: 1,
      cellRenderer: (params: ICellRendererParams<SuperadminBillingInvoiceSample>) => {
        
        return (
          <button type="button" disabled={!params.data} className="sa-btn-ghost sa-btn-ghost--sm text-info border-border px-2 py-1 h-auto" aria-label={params.data ? tCopy('COPY.DOWNLOAD_SAMPLE_PDF_FOR_INVOICE', { id: params.data.id }) : tCopy('COPY.INVOICE_ROW_UNAVAILABLE')} onClick={() => {
            if (!params.data) return;
            try {
              SuperadminBillingDownloadSampleInvoicePdf(params.data);
              showToast(tCopy("COPY.DOWNLOADED_A_SAMPLE_ONLY_PDF_PREVIEW_IT_IS_NOT_A_LIVE_INVOICE_OR_TAX_DOCUMENT"));
            } catch {
              showToast(tCopy("COPY.PDF_PREVIEW_DOWNLOAD_FAILED_NO_INVOICE_DATA_WAS_CHANGED"));
            }
          }} data-testid={`superadmin-billing-billing-overview-download-sample-pdf-for-invoice-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}>
            <Download size={14} className="mr-1 inline" aria-hidden="true" /> {tCopy("COPY.SAMPLE_PDF")}</button>
        );
      }
    },
  ], [tCopy, showToast]);

  return (
    <div className="sa-page-animate relative">

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>{tCopy("COPY.LIBRARY_OS")}</span><span>/</span><span>{tCopy("COPY.SUPER_ADMIN")}</span><span>/</span><span>{tCopy("COPY.BILLING")}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">{tCopy("COPY.BILLING_REVENUE")}</h1>
          <div className="flex items-center gap-3">
            {(
              <button type="button" className="sa-btn-secondary" onClick={exportInvoicePreviewCsv} data-testid="superadmin-billing-billing-overview-export-csv-2">
                <Download size={16} className="text-secondary" /> {tCopy("COPY.EXPORT_CSV")}
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.INVOICE_AND_PROMOTION_ENTRIES_ARE_LOCAL_DEMONSTRATION_DATA_PROMO_CHANGES_ARE_PREVIEWS_AND_ARE_NOT_LIVE_BILLING_CHANGES")}</p>

      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar">
        {SUPERADMIN_BILLING_TABS.map((tab) => (
          <button type="button"
            key={tab.id}
            onClick={() => navigateToWorkflow(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-info-bg text-primary border border-border shadow-card' 
                : 'text-secondary hover:bg-surface-hover hover:text-primary'
            }`}
           data-testid={`superadmin-billing-billing-overview-set-active-tab-4-${String(tab.id)}`}>
            <tab.icon size={16} /> {tCopy(tab.labelKey)}
          </button>
        ))}
      </div>

      {activeTab === 'invoices' && <SuperadminBillingOverviewKpiCards />}

      <div className="sa-card p-0 overflow-hidden h-125 flex flex-col">
        {activeTab === 'invoices' && (
          <div className="flex-1 w-full motion-safe:animate-fade-in motion-reduce:animate-none">
            <SuperadminBillingOverviewSemanticTable rowData={invoices} columnDefs={colDefs} headerHeight={48} rowHeight={64} suppressCellFocus pagination paginationPageSize={10} />
          </div>
        )}

        
      </div>

      {/* Promo Code Modal — preview-only, with validated fields and accessible focus lifecycle. */}
      
    </div>
  );
}
