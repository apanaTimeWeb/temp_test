'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, RotateCcw, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import type { SemanticCellParams as ICellRendererParams, SemanticColumnDef as ColDef } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewSemanticTable';
import SuperadminBillingOverviewSemanticTable from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewSemanticTable';
import { SuperadminBillingDownloadSampleInvoicePdf } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/utils/SuperadminBillingOverviewSamplePdf';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/types/SuperadminBillingOverviewTypes';
import SuperadminBillingOverviewKpiCards from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewKpiCards';

function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  for (const field of ['id', 'uuid', 'recordId', 'invoiceId', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

interface Props {
  invoices: SuperadminBillingInvoiceSample[];
}

export default function SuperadminBillingOverviewInvoicesTab({ invoices }: Props) {
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_billing:invoices:feedback' });
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

  const colDefs = useMemo<ColDef<SuperadminBillingInvoiceSample>[]>(() => [
    { headerName: tCopy('COPY.TABLE_COLUMN_INVOICE_ID'), field: 'id', flex: 1.2, cellClass: () => 'sa-cell-primary-bold' },
    { headerName: tCopy('COPY.TABLE_COLUMN_TENANT_LIBRARY'), field: 'tenant', flex: 1.5, cellClass: () => 'sa-cell-muted' },
    { headerName: tCopy('COPY.TABLE_COLUMN_DATE'), field: 'date', flex: 1, cellClass: () => 'sa-cell-muted-sm' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_AMOUNT'),
      field: 'amount',
      flex: 1,
      cellRenderer: (p: ICellRendererParams<SuperadminBillingInvoiceSample>) => (
        <span className="text-xs font-bold text-success font-mono">
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
          {p.value === 'Paid' ? <CheckCircle size={11} className="mr-1 inline text-success" /> : <AlertCircle size={11} className="mr-1 inline text-danger" />}{' '}
          {p.value === 'Paid' ? tCopy('COPY.PAID') : tCopy('COPY.OVERDUE')}
        </span>
      ),
    },
    { headerName: tCopy('COPY.TABLE_COLUMN_METHOD'), field: 'method', flex: 1, cellClass: () => 'sa-cell-muted' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_ACTION'),
      flex: 1,
      cellRenderer: (params: ICellRendererParams<SuperadminBillingInvoiceSample>) => (
        <button
          type="button"
          disabled={!params.data}
          className="sa-btn-ghost sa-btn-ghost--sm text-primary border-border px-2 py-1 h-auto motion-safe:transition-colors"
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
      ),
    },
  ], [tCopy]);

  return (
    <div className="space-y-4">
      <SuperadminBillingOverviewKpiCards />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl border border-border bg-card shadow-card flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
          <input
            maxLength={100}
            type="search"
            placeholder="Search collection ledger, tenant, GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-border bg-input text-primary placeholder:text-secondary focus:border-primary focus:outline-none"
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
          className="rounded-xl border border-border bg-input px-3 py-2 text-xs font-medium text-primary hover:border-primary cursor-pointer"
        >
          <option value="all">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Pending">Pending</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="rounded-xl border border-border bg-input px-3 py-2 text-xs font-medium text-primary hover:border-primary cursor-pointer"
        >
          <option value="all">All Payment Methods</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="NetBanking">Net Banking</option>
        </select>

        {hasActiveFilters && (
          <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-danger-bg text-danger border border-border cursor-pointer">
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}

        <div className="ml-auto text-xs text-secondary font-medium px-2.5 py-1 rounded-md bg-input border border-border">
          {filteredInvoices.length} of {invoices.length} Records
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card h-125 flex flex-col">
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
  );
}
