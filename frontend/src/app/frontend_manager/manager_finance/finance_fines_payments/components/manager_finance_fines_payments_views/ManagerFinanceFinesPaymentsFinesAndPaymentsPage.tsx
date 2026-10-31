'use client';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS, MANAGER_FINANCE_SAMPLE_PENDING_FINES, MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY, MANAGER_FINANCE_SAMPLE_RECEIPTS } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsDemoRepository';
import ManagerFinanceFinesPaymentsNativeTable, { type NativeColumn, type NativeCellParams } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_table_parts/ManagerFinanceFinesPaymentsNativeTable';

import { useManagerFinesPaymentsFormatting } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsFormattingHook';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MANAGER_FINANCE_FINES_PAYMENTS_ROUTES } from '@/app/frontend_manager/manager_finance/finance_fines_payments/config/manager_finance_fines_payments.url_config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerFinanceFineCollectionDraftSchema, type ManagerFinanceFinesPaymentsFineCollectionDraft } from '@/app/frontend_manager/manager_finance/finance_fines_payments/schemas/ManagerFinanceFinesPaymentsFineCollectionDraftSchema';
import { AlertCircle, DollarSign, FileText, CheckCircle, RotateCcw, Receipt, History, AlertTriangle, Search, IndianRupee, HandCoins, Clock, Eye, Printer, MessageSquare, Mail, Smartphone, X, UserCheck } from 'lucide-react';
import type { ManagerFinanceFinesPaymentsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsComponentTypes';
import { toast } from 'sonner';

export interface ManagerReceiptRecord {
  id: string;
  receiptNumber: string;
  txnId: string;
  member: string;
  plan: string;
  lateFee: number;
  amount: number;
  mode: string;
  date: string;
  status: string;
  phone: string;
  email: string;
  collectedBy: string;
}

export default function ManagerFinanceFinesPaymentsFinesAndPaymentsPage(_routeQuery: ManagerFinanceFinesPaymentsRouteQueryProps) {
  const router = useRouter();
  const tManagerUi = useTranslations('manager.manager_fines_payments.ui');
  const { formatCurrency } = useManagerFinesPaymentsFormatting();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collectionDraftFeedback, setCollectionDraftFeedback] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ManagerReceiptRecord | null>(null);

  const handleShareWhatsApp = (r: ManagerReceiptRecord) => {
    const text = encodeURIComponent(
      `Hello ${r.member}, your Library fee receipt #${r.receiptNumber} (${r.plan}) of ${formatCurrency(r.amount)} is confirmed. Txn ID: ${r.txnId}.`
    );
    window.open(`https://wa.me/91${r.phone}?text=${text}`, '_blank');
    toast.success(`WhatsApp receipt link generated for ${r.member}`);
  };

  const handleShareEmail = (r: ManagerReceiptRecord) => {
    const subject = encodeURIComponent(`Library Receipt #${r.receiptNumber} - ${r.plan}`);
    const body = encodeURIComponent(
      `Dear ${r.member},\n\nHere is your receipt for ${r.plan}.\nReceipt No: ${r.receiptNumber}\nTxn ID: ${r.txnId}\nAmount: ${formatCurrency(r.amount)}\nLate Fee: ${formatCurrency(r.lateFee)}\nStatus: ${r.status}\nDate: ${r.date}\n\nThank you,\nLibrary Management`
    );
    window.location.href = `mailto:${r.email}?subject=${subject}&body=${body}`;
    toast.success(`Email client opened for ${r.email}`);
  };

  const handleShareSms = (r: ManagerReceiptRecord) => {
    toast.success(`SMS receipt dispatched to +91 ${r.phone} for Txn ${r.txnId}`);
  };

  const handlePrintReceipt = (_r: ManagerReceiptRecord) => {
    window.print();
  };
  
  const { register: registerCollection, handleSubmit: handleCollectionSubmit, formState: { errors: collectionErrors } } = useForm<ManagerFinanceFinesPaymentsFineCollectionDraft>({
    resolver: zodResolver(managerFinanceFineCollectionDraftSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { member: '', fineId: '', amount: '', mode: 'cash', txnId: '' },
  });
  const onValidateCollectionDraft = handleCollectionSubmit(() => {
    setCollectionDraftFeedback(tManagerUi('collection_unavailable_verified_api_contract_not_supplie_cbded7'));
  });
  const collectionFieldError = (field: Extract<keyof ManagerFinanceFinesPaymentsFineCollectionDraft, string>) => collectionErrors[field] ? (
    <p id={`fine-collection-${field}-error`} className="text-sm text-danger" role="alert">{tManagerUi('validation_field_invalid')}</p>
  ) : null;

  const TABS = [
    { id: 'dashboard', labelKey: 'fines_dashboard_tab', icon: DollarSign },
    { id: 'pending', labelKey: 'pending_fines_tab', icon: AlertCircle },
    { id: 'paid', labelKey: 'paid_fines_tab', icon: CheckCircle },
    { id: 'partiallyPaid', labelKey: 'partially_paid_tab', icon: RotateCcw },
    { id: 'receipts', labelKey: 'receipts_tab', icon: Receipt },
    { id: 'refundRequests', labelKey: 'refund_requests_tab', icon: RotateCcw },
  ] as const;



  const translateFineType = useCallback((value: unknown) => {
    switch (String(value ?? '')) {
      case 'Overdue Book': return tManagerUi('overdue_book');
      case 'Lost Book Charge': return tManagerUi('lost_book_charge');
      case 'Damage Charge': return tManagerUi('damage_charge');
      case 'Late Fee': return tManagerUi('late_fee');
      default: return String(value ?? '');
    }
  }, [tManagerUi]);

  const translatePaymentMode = useCallback((value: unknown) => {
    const mode = String(value ?? '').trim().toLowerCase();
    if (mode === 'cash') return tManagerUi('cash');
    if (mode === 'upi') return tManagerUi('upi');
    if (mode === 'card') return tManagerUi('card');
    if (mode === 'bank' || mode === 'bank transfer') return tManagerUi('bank');
    return String(value ?? '');
  }, [tManagerUi]);

  const receiptRows = useMemo<ManagerReceiptRecord[]>(() => MANAGER_FINANCE_SAMPLE_RECEIPTS.map((r) => ({
    id: r.id,
    txnId: r.id,
    receiptNumber: r.receiptNumber,
    member: `${r.studentName} (${r.studentId})`,
    plan: r.planName,
    lateFee: Number(r.lateFee ?? 0),
    amount: Number(r.amount),
    mode: r.paymentMode,
    date: r.date.split('T')[0],
    status: r.status ?? 'Completed',
    phone: r.phone,
    email: `${r.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    collectedBy: (r as unknown as { collectedBy?: string }).collectedBy ?? 'Branch Manager Satyam',
  })), []);

  // Native semantic table column definitions
  const pendingCols: NativeColumn[] = useMemo(() => [
    { field: 'id', headerName: tManagerUi('fine_id'), width: 120 },
    { field: 'member', headerName: tManagerUi('member_6853c9'), flex: 1 },
    { field: 'type', headerName: tManagerUi('type'), flex: 1, valueFormatter: (p) => translateFineType(p.value) },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 120, valueFormatter: (p: NativeCellParams) => formatCurrency(Number(p.value ?? 0)) },
    { field: 'date', headerName: tManagerUi('date'), width: 150 },
    { field: 'status', headerName: tManagerUi('status'), width: 150, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--warning">{p.value === 'Pending' ? tManagerUi('status_pending') : p.value === 'Partially Paid' ? tManagerUi('status_partially_paid') : String(p.value ?? '')}</span> },
  ], [formatCurrency, tManagerUi, translateFineType]);

  const historyCols: NativeColumn[] = useMemo(() => [
    { field: 'receipt', headerName: tManagerUi('receipt_097d66'), width: 130 },
    { field: 'member', headerName: tManagerUi('member_6853c9'), flex: 1 },
    { field: 'type', headerName: tManagerUi('fine_type'), flex: 1, valueFormatter: (p) => translateFineType(p.value) },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 120, cellClass: 'text-success font-bold', valueFormatter: (p: NativeCellParams) => formatCurrency(Number(p.value ?? 0)) },
    { field: 'mode', headerName: tManagerUi('mode'), width: 120, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--info">{translatePaymentMode(p.value)}</span> },
    { field: 'date', headerName: tManagerUi('date_time_853aab'), width: 160 },
    { field: 'collectedBy', headerName: tManagerUi('collected_by_898bb0'), width: 140 },
  ], [formatCurrency, tManagerUi, translateFineType, translatePaymentMode]);

  const receiptsCols: NativeColumn[] = useMemo(() => [
    { field: 'txnId', headerName: 'Transaction ID', width: 140, cellRenderer: (p: NativeCellParams) => <span className="font-mono text-xs font-semibold text-primary">{String(p.value ?? '—')}</span> },
    { field: 'receiptNumber', headerName: tManagerUi('receipt_097d66'), width: 130, cellRenderer: (p: NativeCellParams) => <span className="text-xs font-semibold">{String(p.value ?? '—')}</span> },
    { field: 'member', headerName: tManagerUi('member_6853c9'), flex: 1, minWidth: 160 },
    { field: 'plan', headerName: 'Plan', flex: 1, minWidth: 150, cellRenderer: (p: NativeCellParams) => <span className="fin-badge fin-badge--neutral text-xs">{String(p.value ?? '—')}</span> },
    { field: 'lateFee', headerName: 'Late Fee', width: 110, cellRenderer: (p: NativeCellParams) => <span className={Number(p.value ?? 0) > 0 ? 'text-amber-600 font-bold text-xs' : 'text-secondary text-xs'}>{formatCurrency(Number(p.value ?? 0))}</span> },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 120, cellClass: 'text-success font-bold', cellRenderer: (p: NativeCellParams) => <span className="text-success font-bold text-xs">{formatCurrency(Number(p.value ?? 0))}</span> },
    { field: 'mode', headerName: tManagerUi('mode'), width: 100, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--info text-xs">{translatePaymentMode(p.value)}</span> },
    { field: 'date', headerName: tManagerUi('date_time_853aab'), width: 140, cellRenderer: (p: NativeCellParams) => <span className="text-xs text-secondary">{String(p.value ?? '—')}</span> },
    { field: 'collectedBy', headerName: 'Collected By', width: 150, cellRenderer: (p: NativeCellParams) => <span className="text-xs font-medium text-primary flex items-center gap-1.5"><UserCheck size={13} className="text-secondary" />{String(p.value ?? 'Branch Manager Satyam')}</span> },
    { field: 'status', headerName: tManagerUi('status'), width: 110, cellRenderer: (p: NativeCellParams) => <span className="mgr-badge mgr-badge--success text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60">{String(p.value ?? 'Completed')}</span> },
    {
      headerName: tManagerUi('actions'),
      width: 200,
      sortable: false,
      cellRenderer: (p: NativeCellParams) => {
        const row = p.data as ManagerReceiptRecord;
        return (
          <div className="flex items-center gap-1.5 h-full">
            <button
              type="button"
              onClick={() => setSelectedReceipt(row)}
              className="p-1 rounded hover:bg-surface-hover text-primary transition-colors cursor-pointer"
              title="View Receipt Details"
            >
              <Eye size={15} />
            </button>
            <button
              type="button"
              onClick={() => handlePrintReceipt(row)}
              className="p-1 rounded hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleShareWhatsApp(row)}
              className="p-1 rounded hover:bg-surface-hover text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
              title="Share via WhatsApp"
            >
              <MessageSquare size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleShareEmail(row)}
              className="p-1 rounded hover:bg-surface-hover text-purple hover:text-purple-700 transition-colors cursor-pointer"
              title="Share via Email"
            >
              <Mail size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleShareSms(row)}
              className="p-1 rounded hover:bg-surface-hover text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              title="Share via SMS"
            >
              <Smartphone size={15} />
            </button>
          </div>
        );
      }
    }
  ], [formatCurrency, tManagerUi, translatePaymentMode]);

  return (
    <div className="mgr-page-animate relative pb-12"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      {/* Header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="mgr-breadcrumb">
          <span>{tManagerUi('finance')}</span><span>/</span><span>{tManagerUi('fines_payments')}</span>
        </div>
        <h1 className="mgr-page-title flex items-center gap-3 mt-2">
          <DollarSign className="text-primary" size={28} /> {tManagerUi('fines_payments')}
        </h1>
        <p className="text-sm text-secondary">{tManagerUi('manage_fine_collections_view_pending_dues_and_request_re_7b6cc6')}</p>
        <p className="mt-2 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" data-testid="manager-finance-fines-sample-warning" role="status">{tManagerUi('this_page_displays_sample_financial_records_for_layout_r_04f8ef')}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Sidebar Tabs */}
        <div className="xl:col-span-3 space-y-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === 'refundRequests') {
                    router.push(MANAGER_FINANCE_FINES_PAYMENTS_ROUTES.REFUNDS);
                    return;
                  }
                  setActiveTab(tab.id);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold motion-safe:transition-all ${
                  isActive 
                    ? 'bg-primary text-on-primary shadow-lg' 
                    : 'text-secondary hover:bg-card hover:text-primary'
                }`}
              >
                <tab.icon size={18} className={isActive ? 'text-primary' : 'opacity-70'} />
                {tManagerUi(tab.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="xl:col-span-9 mgr-card p-6 min-h-96">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="motion-safe:transition-all motion-safe:duration-base">
              <h2 className="text-xl font-bold text-primary mb-6 border-b border-border pb-4">{tManagerUi('fine_collection_overview')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {([
                  { labelKey: 'total_pending_fines', value: formatCurrency(MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS.totalPendingFines), icon: AlertCircle, color: 'text-danger', bg: 'bg-danger-bg' },
                  { labelKey: 'todays_collection', value: formatCurrency(MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS.todaysCollection), icon: IndianRupee, color: 'text-success', bg: 'bg-success-bg' },
                  { labelKey: 'overdue_fines_kpi', value: formatCurrency(MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS.overdueFines), icon: Clock, color: 'text-warning', bg: 'bg-warning-bg' },
                  { labelKey: 'lost_book_charges_kpi', value: formatCurrency(MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS.lostBookCharges), icon: FileText, color: 'text-info', bg: 'bg-info-bg' },
                  { labelKey: 'damage_charges_kpi', value: formatCurrency(MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS.damageCharges), icon: AlertTriangle, color: 'text-purple', bg: 'bg-purple-bg' },
                ] as const).map((kpi, i) => (
                  <div key={kpi.labelKey} className="p-4 rounded-xl bg-card border border-border hover:bg-surface-hover motion-safe:transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                        <kpi.icon size={20} />
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">{tManagerUi(kpi.labelKey)}</p>
                    <h3 className="text-2xl font-black text-primary">{kpi.value}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PENDING FINES (AG GRID) */}
          {(activeTab === 'pending' || activeTab === 'partiallyPaid') && (
            <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
              <h2 className="text-xl font-bold text-primary mb-6 border-b border-border pb-4">{tManagerUi(TABS.find((tab) => tab.id === activeTab)?.labelKey ?? 'fines_dashboard_tab')}</h2>
              <div className="flex-1 w-full h-96">
                <ManagerFinanceFinesPaymentsNativeTable getRowKey={(row) => String(row.id)} emptyMessage={tManagerUi('no_receipts_found')} rows={MANAGER_FINANCE_SAMPLE_PENDING_FINES.filter(f => activeTab === 'pending' ? f.status === 'Pending' : f.status === 'Partially Paid')} columns={pendingCols} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
              </div>
            </div>
          )}

          {/* PAID FINES (AG GRID) */}
          {activeTab === 'paid' && (
            <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
              <h2 className="text-xl font-bold text-primary mb-6 border-b border-border pb-4">{tManagerUi(TABS.find((tab) => tab.id === activeTab)?.labelKey ?? 'fines_dashboard_tab')}</h2>
              <div className="flex-1 w-full h-96">
                <ManagerFinanceFinesPaymentsNativeTable getRowKey={(row) => String(row.id)} emptyMessage={tManagerUi('no_receipts_found')} rows={MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY} columns={historyCols} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
              </div>
            </div>
          )}

          {/* RECEIPTS TAB (AG GRID with Transaction ID, Late Fee, Plan, Status, Actions, View/Print/Share) */}
          {activeTab === 'receipts' && (
            <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold text-primary">{tManagerUi('receipts_tab')}</h2>
                  <p className="text-xs text-secondary mt-1">Official transaction receipts with late fees, plan details, and multi-channel dispatch</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mgr-badge mgr-badge--info font-mono text-xs">{receiptRows.length} Total Receipts</span>
                </div>
              </div>
              <div className="flex-1 w-full h-96">
                <ManagerFinanceFinesPaymentsNativeTable getRowKey={(row) => String(row.id)} emptyMessage={tManagerUi('no_receipts_found')} rows={receiptRows} columns={receiptsCols} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Selected Receipt Details & Multi-Channel Share Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden motion-safe:animate-scale-up">
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface-highlight">
              <div className="flex items-center gap-2">
                <Receipt className="text-primary" size={20} />
                <h3 className="font-bold text-primary text-base">Receipt Details — {selectedReceipt.receiptNumber}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg hover:bg-card text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-highlight border border-border text-xs font-mono">
                <div>
                  <span className="text-secondary block">Transaction ID</span>
                  <span className="font-bold text-primary">{selectedReceipt.txnId}</span>
                </div>
                <div>
                  <span className="text-secondary block">Receipt Number</span>
                  <span className="font-bold text-primary">{selectedReceipt.receiptNumber}</span>
                </div>
                <div>
                  <span className="text-secondary block">Member</span>
                  <span className="font-bold text-primary">{selectedReceipt.member}</span>
                </div>
                <div>
                  <span className="text-secondary block">Contact Phone</span>
                  <span className="text-primary">+91 {selectedReceipt.phone}</span>
                </div>
                <div>
                  <span className="text-secondary block">Membership Plan</span>
                  <span className="font-semibold text-primary">{selectedReceipt.plan}</span>
                </div>
                <div>
                  <span className="text-secondary block">Payment Mode</span>
                  <span className="font-semibold text-primary uppercase">{selectedReceipt.mode}</span>
                </div>
                <div>
                  <span className="text-secondary block">Date & Time</span>
                  <span className="text-primary">{selectedReceipt.date}</span>
                </div>
                <div>
                  <span className="text-secondary block">Collected By</span>
                  <span className="font-semibold text-primary">{selectedReceipt.collectedBy}</span>
                </div>
                <div>
                  <span className="text-secondary block">Payment Status</span>
                  <span className="mgr-badge mgr-badge--success text-xs font-bold">{selectedReceipt.status}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-sm">
                <div className="flex justify-between text-secondary">
                  <span>Base Fee:</span>
                  <span>{formatCurrency(selectedReceipt.amount - selectedReceipt.lateFee)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Late Fee:</span>
                  <span className={selectedReceipt.lateFee > 0 ? 'text-amber-600 font-bold' : ''}>{formatCurrency(selectedReceipt.lateFee)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-base text-primary">
                  <span>Total Paid:</span>
                  <span className="text-success">{formatCurrency(selectedReceipt.amount)}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Share & Print Options</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePrintReceipt(selectedReceipt)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-primary transition-colors cursor-pointer"
                  >
                    <Printer size={14} /> Print
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(selectedReceipt)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <MessageSquare size={14} /> WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareEmail(selectedReceipt)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple hover:bg-purple-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Mail size={14} /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareSms(selectedReceipt)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Smartphone size={14} /> SMS
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-surface-highlight flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="mgr-btn-secondary mgr-btn-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
