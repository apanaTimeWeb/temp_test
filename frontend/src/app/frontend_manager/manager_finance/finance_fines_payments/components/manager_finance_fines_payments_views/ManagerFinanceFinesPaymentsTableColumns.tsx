'use client';

import type { NativeCellParams,NativeColumn } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_table_parts/ManagerFinanceFinesPaymentsNativeTable';
import { Eye,Mail,MessageSquare,Printer,Smartphone,UserCheck } from 'lucide-react';
import type { ManagerReceiptRecord } from './ManagerFinanceFinesPaymentsFinesAndPaymentsPage';

export interface UseTableColumnsParams {
  formatCurrency: (amount: number) => string;
  translateFineType?: (val: unknown) => string;
  translatePaymentMode: (val: unknown) => string;
  tManagerUi: (k: string) => string;
  onSelectReceipt: (r: ManagerReceiptRecord) => void;
  onPrintReceipt: (r: ManagerReceiptRecord) => void;
  onShareWhatsApp: (r: ManagerReceiptRecord) => void;
  onShareEmail: (r: ManagerReceiptRecord) => void;
  onShareSms: (r: ManagerReceiptRecord) => void;
}

export function buildPendingCols(
  formatCurrency: (amount: number) => string,
  translateFineType: (val: unknown) => string,
  tManagerUi: (k: string) => string,
  onAddToRenewal?: (fine: { id: string; member: string; amount: number }) => void,
  renewalAddedIds: Set<string> = new Set()
): NativeColumn[] {
  return [
    { field: 'id', headerName: tManagerUi('fine_id'), width: 110 },
    { field: 'member', headerName: tManagerUi('member_6853c9'), flex: 1 },
    { field: 'type', headerName: tManagerUi('type'), flex: 1, valueFormatter: (p) => translateFineType(p.value) },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 110, valueFormatter: (p: NativeCellParams) => formatCurrency(Number(p.value ?? 0)) },
    { field: 'date', headerName: tManagerUi('date'), width: 130 },
    {
      field: 'status',
      headerName: tManagerUi('status'),
      width: 140,
      cellRenderer: (p: NativeCellParams) => {
        const isPending = p.value === 'Pending';
        const label = isPending ? tManagerUi('status_pending') : p.value === 'Partially Paid' ? tManagerUi('status_partially_paid') : String(p.value ?? '');
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            isPending
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-rose-500' : 'bg-amber-500'}`} />
            {label}
          </span>
        );
      },
    },
    {
      headerName: 'Renewal Bill Action',
      width: 200,
      sortable: false,
      cellRenderer: (p: NativeCellParams) => {
        const row = p.data as { id: string; member: string; amount: number };
        const isAdded = renewalAddedIds.has(row.id);
        return (
          <div className="flex items-center gap-1.5 h-full">
            {isAdded ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                ✓ Added to Next Renewal
              </span>
            ) : (
              <button
                type="button"
                data-testid={`add-to-renewal-btn-${row.id}`}
                onClick={() => onAddToRenewal && onAddToRenewal(row)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors cursor-pointer"
                title={`Auto-add fine to next renewal bill for ${row.member}`}
              >
                + Add to Next Renewal
              </button>
            )}
          </div>
        );
      },
    },
  ];
}

export function buildHistoryCols(
  formatCurrency: (amount: number) => string,
  translateFineType: (val: unknown) => string,
  translatePaymentMode: (val: unknown) => string,
  tManagerUi: (k: string) => string
): NativeColumn[] {
  return [
    { field: 'receipt', headerName: tManagerUi('receipt_097d66'), width: 130 },
    { field: 'member', headerName: tManagerUi('member_6853c9'), flex: 1 },
    { field: 'type', headerName: tManagerUi('fine_type'), flex: 1, valueFormatter: (p) => translateFineType(p.value) },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 120, cellClass: 'text-success font-bold', valueFormatter: (p: NativeCellParams) => formatCurrency(Number(p.value ?? 0)) },
    {
      field: 'mode',
      headerName: tManagerUi('mode'),
      width: 120,
      cellRenderer: (p: NativeCellParams) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          {translatePaymentMode(p.value)}
        </span>
      ),
    },
    { field: 'date', headerName: tManagerUi('date_time_853aab'), width: 160 },
    { field: 'collectedBy', headerName: tManagerUi('collected_by_898bb0'), width: 140 },
  ];
}

export function buildReceiptsCols({
  formatCurrency,
  translatePaymentMode,
  tManagerUi,
  onSelectReceipt,
  onPrintReceipt,
  onShareWhatsApp,
  onShareEmail,
  onShareSms,
}: UseTableColumnsParams): NativeColumn[] {
  return [
    { field: 'txnId', headerName: 'Transaction ID', width: 140, cellRenderer: (p: NativeCellParams) => <span className="font-mono text-xs font-semibold text-primary">{String(p.value ?? '—')}</span> },
    { field: 'receiptNumber', headerName: tManagerUi('receipt_097d66'), width: 130, cellRenderer: (p: NativeCellParams) => <span className="text-xs font-semibold">{String(p.value ?? '—')}</span> },
    { field: 'member', headerName: tManagerUi('member_6853c9'), flex: 1, minWidth: 160 },
    { field: 'plan', headerName: 'Plan', flex: 1, minWidth: 150, cellRenderer: (p: NativeCellParams) => <span className="fin-badge fin-badge--neutral text-xs">{String(p.value ?? '—')}</span> },
    { field: 'lateFee', headerName: 'Late Fee', width: 110, cellRenderer: (p: NativeCellParams) => <span className={Number(p.value ?? 0) > 0 ? 'text-amber-600 font-bold text-xs' : 'text-secondary text-xs'}>{formatCurrency(Number(p.value ?? 0))}</span> },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 120, cellClass: 'text-success font-bold', cellRenderer: (p: NativeCellParams) => <span className="text-success font-bold text-xs">{formatCurrency(Number(p.value ?? 0))}</span> },
    {
      field: 'mode',
      headerName: tManagerUi('mode'),
      width: 100,
      cellRenderer: (p: NativeCellParams) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          {translatePaymentMode(p.value)}
        </span>
      ),
    },
    { field: 'date', headerName: tManagerUi('date_time_853aab'), width: 140, cellRenderer: (p: NativeCellParams) => <span className="text-xs text-secondary">{String(p.value ?? '—')}</span> },
    { field: 'collectedBy', headerName: 'Collected By', width: 150, cellRenderer: (p: NativeCellParams) => <span className="text-xs font-medium text-primary flex items-center gap-1.5"><UserCheck size={13} className="text-secondary" />{String(p.value ?? 'Branch Manager Satyam')}</span> },
    {
      field: 'status',
      headerName: tManagerUi('status'),
      width: 110,
      cellRenderer: (p: NativeCellParams) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {String(p.value ?? 'Completed')}
        </span>
      ),
    },
    {
      headerName: tManagerUi('actions'),
      width: 210,
      sortable: false,
      cellRenderer: (p: NativeCellParams) => {
        const row = p.data as ManagerReceiptRecord;
        return (
          <div className="flex items-center gap-1.5 h-full">
            <button
              type="button"
              onClick={() => onSelectReceipt(row)}
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-primary hover:text-white hover:border-primary text-secondary transition-all cursor-pointer shadow-2xs active:scale-95"
              title="View Receipt Details"
            >
              <Eye size={14} />
            </button>
            <button
              type="button"
              onClick={() => onPrintReceipt(row)}
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-slate-800 hover:text-white hover:border-slate-800 text-secondary transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Print Receipt"
            >
              <Printer size={14} />
            </button>
            <button
              type="button"
              onClick={() => onShareWhatsApp(row)}
              className="p-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Share via WhatsApp"
            >
              <MessageSquare size={14} />
            </button>
            <button
              type="button"
              onClick={() => onShareEmail(row)}
              className="p-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10 hover:bg-purple-600 hover:text-white hover:border-purple-600 text-purple-600 dark:text-purple-400 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Share via Email"
            >
              <Mail size={14} />
            </button>
            <button
              type="button"
              onClick={() => onShareSms(row)}
              className="p-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-blue-600 dark:text-blue-400 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Share via SMS"
            >
              <Smartphone size={14} />
            </button>
          </div>
        );
      },
    },
  ];
}

