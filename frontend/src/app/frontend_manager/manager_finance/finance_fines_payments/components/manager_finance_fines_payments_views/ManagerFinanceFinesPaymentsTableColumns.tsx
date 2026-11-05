'use client';

import React from 'react';
import type { NativeColumn, NativeCellParams } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_table_parts/ManagerFinanceFinesPaymentsNativeTable';
import { Eye, Printer, MessageSquare, Mail, Smartphone, UserCheck } from 'lucide-react';
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
  tManagerUi: (k: string) => string
): NativeColumn[] {
  return [
    { field: 'id', headerName: tManagerUi('fine_id'), width: 120 },
    { field: 'member', headerName: tManagerUi('member_6853c9'), flex: 1 },
    { field: 'type', headerName: tManagerUi('type'), flex: 1, valueFormatter: (p) => translateFineType(p.value) },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 120, valueFormatter: (p: NativeCellParams) => formatCurrency(Number(p.value ?? 0)) },
    { field: 'date', headerName: tManagerUi('date'), width: 150 },
    {
      field: 'status',
      headerName: tManagerUi('status'),
      width: 150,
      cellRenderer: (p: NativeCellParams) => (
        <span className="mgr-badge mgr-badge--warning">
          {p.value === 'Pending' ? tManagerUi('status_pending') : p.value === 'Partially Paid' ? tManagerUi('status_partially_paid') : String(p.value ?? '')}
        </span>
      ),
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
    { field: 'mode', headerName: tManagerUi('mode'), width: 120, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--info">{translatePaymentMode(p.value)}</span> },
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
    { field: 'mode', headerName: tManagerUi('mode'), width: 100, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--info text-xs">{translatePaymentMode(p.value)}</span> },
    { field: 'date', headerName: tManagerUi('date_time_853aab'), width: 140, cellRenderer: (p: NativeCellParams) => <span className="text-xs text-secondary">{String(p.value ?? '—')}</span> },
    { field: 'collectedBy', headerName: 'Collected By', width: 150, cellRenderer: (p: NativeCellParams) => <span className="text-xs font-medium text-primary flex items-center gap-1.5"><UserCheck size={13} className="text-secondary" />{String(p.value ?? 'Branch Manager Satyam')}</span> },
    { field: 'status', headerName: tManagerUi('status'), width: 110, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--success text-xs font-semibold text-success bg-success-bg border border-border">{String(p.value ?? 'Completed')}</span> },
    {
      headerName: tManagerUi('actions'),
      width: 200,
      sortable: false,
      cellRenderer: (p: NativeCellParams) => {
        const row = p.data as ManagerReceiptRecord;
        return (
          <div className="flex items-center gap-1.5 h-full">
            <button type="button" onClick={() => onSelectReceipt(row)} className="p-1 rounded hover:bg-surface-hover text-primary transition-colors cursor-pointer" title="View Receipt Details">
              <Eye size={15} />
            </button>
            <button type="button" onClick={() => onPrintReceipt(row)} className="p-1 rounded hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer" title="Print Receipt">
              <Printer size={15} />
            </button>
            <button type="button" onClick={() => onShareWhatsApp(row)} className="p-1 rounded hover:bg-surface-hover text-success hover:opacity-80 transition-colors cursor-pointer" title="Share via WhatsApp">
              <MessageSquare size={15} />
            </button>
            <button type="button" onClick={() => onShareEmail(row)} className="p-1 rounded hover:bg-surface-hover text-purple hover:opacity-80 transition-colors cursor-pointer" title="Share via Email">
              <Mail size={15} />
            </button>
            <button type="button" onClick={() => onShareSms(row)} className="p-1 rounded hover:bg-surface-hover text-info hover:opacity-80 transition-colors cursor-pointer" title="Share via SMS">
              <Smartphone size={15} />
            </button>
          </div>
        );
      },
    },
  ];
}

