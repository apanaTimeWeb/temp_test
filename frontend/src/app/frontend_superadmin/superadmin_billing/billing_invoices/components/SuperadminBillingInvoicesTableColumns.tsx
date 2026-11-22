'use client';

import { useMemo } from 'react';
import {
  CheckCircle, Download, AlertCircle, Eye, RotateCcw as RefundIcon,
  MessageSquare, Mail,
} from 'lucide-react';
import type {
  SemanticColumnDef as ColDef,
  SemanticCellParams as ICellRendererParams,
} from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesSemanticTable';
import { SuperadminBillingDownloadSampleInvoicePdf } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesSamplePdf';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';

interface UseBillingColumnsProps {
  handleOpenDetail: (inv: SuperadminBillingInvoiceSample) => void;
  showToast: (msg: string) => void;
  setCreditNoteInvoice: (inv: SuperadminBillingInvoiceSample) => void;
  tCopy: (key: string) => string;
}

export function useSuperadminBillingInvoicesColumns({
  handleOpenDetail,
  showToast,
  setCreditNoteInvoice,
  tCopy,
}: UseBillingColumnsProps): ColDef<SuperadminBillingInvoiceSample>[] {
  return useMemo<ColDef<SuperadminBillingInvoiceSample>[]>(() => [
    { headerName: tCopy('COPY.TABLE_COLUMN_INVOICE_ID'), field: 'id', flex: 1.1, cellClass: () => 'sa-cell-primary-bold' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_TENANT_LIBRARY'),
      field: 'tenant',
      flex: 1.5,
      cellRenderer: (p: ICellRendererParams<SuperadminBillingInvoiceSample>) => (
        <div>
          <span className="font-semibold text-slate-100">{p.data?.tenant}</span>
          {p.data?.legalName && <div className="text-[10px] text-slate-400 truncate">{p.data.legalName}</div>}
        </div>
      ),
    },
    { headerName: tCopy('COPY.TABLE_COLUMN_DATE'), field: 'date', flex: 0.9, cellClass: () => 'sa-cell-muted-sm' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_AMOUNT'),
      field: 'amount',
      flex: 1,
      cellRenderer: (p: ICellRendererParams<SuperadminBillingInvoiceSample>) => (
        <span className="text-xs font-bold text-emerald-400 font-mono">₹{Number(p.value ?? 0).toLocaleString('en-IN')}</span>
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
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
            isPaid ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400' : isOverdue ? 'border-rose-500/30 bg-rose-500/15 text-rose-400' : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
          }`}>
            {isPaid ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
            <span>{val}</span>
          </span>
        );
      },
    },
    { headerName: tCopy('COPY.TABLE_COLUMN_METHOD'), field: 'method', flex: 0.9, cellClass: () => 'sa-cell-muted font-mono text-xs' },
    {
      headerName: tCopy('COPY.TABLE_COLUMN_ACTION'),
      flex: 2.2,
      minWidth: 260,
      cellRenderer: (params: ICellRendererParams<SuperadminBillingInvoiceSample>) => {
        if (!params.data) return null;
        const inv = params.data;
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button type="button" onClick={() => handleOpenDetail(inv)} className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-2 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 cursor-pointer" title="View Detailed Tax Invoice">
              <Eye size={12} /> <span>View</span>
            </button>
            <button type="button" onClick={() => SuperadminBillingDownloadSampleInvoicePdf(inv)} className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 cursor-pointer" title="Download Official Tax Invoice PDF">
              <Download size={12} />
            </button>
            <button
              type="button"
              onClick={() => {
                const raw = inv.phone || '9876543210';
                let digits = raw.replace(/\D/g, '');
                if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
                const phone = digits.length === 10 ? `91${digits}` : digits;
                const msg = `Hello ${inv.tenant}, your Smart Library tax invoice ${inv.id} for ₹${inv.amount.toLocaleString('en-IN')} (Due: ${inv.dueDate}) is ready.`;
                const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                if (popup) popup.opener = null;
                showToast(`Opened WhatsApp invoice share for ${inv.tenant} (Zero API Cost)`);
              }}
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 cursor-pointer"
              title="Share Invoice on WhatsApp (Free Web)"
            >
              <MessageSquare size={12} />
            </button>
            <button
              type="button"
              onClick={() => {
                const email = inv.email || `accounts@${inv.tenant.toLowerCase().replace(/\s+/g, '')}.in`;
                const subject = `Smart Library SaaS Tax Invoice #${inv.id} - ${inv.tenant}`;
                const body = `Dear ${inv.tenant},\n\nPlease find your official SaaS subscription tax invoice #${inv.id} for ₹${inv.amount.toLocaleString('en-IN')}.\nDue Date: ${inv.dueDate || 'Upon Receipt'}\nStatus: ${inv.status}\n\nThank you for partnering with Smart Library!\nSaaS Finance Team`;
                window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                showToast(`Opening email client for ${inv.tenant}`);
              }}
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-blue-500/30 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 cursor-pointer"
              title="Email Invoice (Free Client)"
            >
              <Mail size={12} />
            </button>
            <button type="button" onClick={() => setCreditNoteInvoice(inv)} className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 cursor-pointer" title="Issue Credit Note / Refund">
              <RefundIcon size={11} /> <span>Credit Note</span>
            </button>
          </div>
        );
      },
    },
  ], [handleOpenDetail, showToast, setCreditNoteInvoice, tCopy]);
}
