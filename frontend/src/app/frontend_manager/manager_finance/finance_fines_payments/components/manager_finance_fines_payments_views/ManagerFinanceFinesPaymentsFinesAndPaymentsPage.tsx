'use client';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS, MANAGER_FINANCE_SAMPLE_PENDING_FINES, MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsDemoRepository';
import ManagerFinanceFinesPaymentsNativeTable, { type NativeColumn, type NativeCellParams } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_table_parts/ManagerFinanceFinesPaymentsNativeTable';

import { useManagerFinesPaymentsFormatting } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsFormattingHook';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MANAGER_FINANCE_FINES_PAYMENTS_ROUTES } from '@/app/frontend_manager/manager_finance/finance_fines_payments/config/manager_finance_fines_payments.url_config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerFinanceFineCollectionDraftSchema, type ManagerFinanceFinesPaymentsFineCollectionDraft } from '@/app/frontend_manager/manager_finance/finance_fines_payments/schemas/ManagerFinanceFinesPaymentsFineCollectionDraftSchema';
import { AlertCircle, DollarSign, FileText, CheckCircle, RotateCcw, Receipt, History, AlertTriangle, Search, IndianRupee, HandCoins, Clock } from 'lucide-react';
import type { ManagerFinanceFinesPaymentsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsComponentTypes';



export default function ManagerFinanceFinesPaymentsFinesAndPaymentsPage(_routeQuery: ManagerFinanceFinesPaymentsRouteQueryProps) {
  const router = useRouter();
  const tManagerUi = useTranslations('manager.manager_fines_payments.ui');
  const { formatCurrency } = useManagerFinesPaymentsFormatting();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collectionDraftFeedback, setCollectionDraftFeedback] = useState<string | null>(null);
  
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
    { id: 'collect', labelKey: 'collect_fine_tab', icon: HandCoins },
    { id: 'paid', labelKey: 'paid_fines_tab', icon: CheckCircle },
    { id: 'partiallyPaid', labelKey: 'partially_paid_tab', icon: RotateCcw },
    { id: 'history', labelKey: 'payment_history_tab', icon: History },
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

          {/* COLLECT FINE */}
          {activeTab === 'collect' && (
            <div className="motion-safe:transition-all motion-safe:duration-base max-w-2xl relative">
              <h2 className="text-xl font-bold text-primary mb-2">{tManagerUi('collect_payment')}</h2>
              <p className="text-sm text-secondary mb-6 border-b border-border pb-4">
                {tManagerUi('record_a_payment_for_an_outstanding_fine_or_charge')}
              </p>
              
              {collectionDraftFeedback && <p className="mb-4 rounded-lg border border-warning bg-warning-bg p-3 text-sm text-warning" role="status" aria-live="polite" data-testid="manager-finance-collection-draft-feedback">{collectionDraftFeedback}</p>}
              <form onSubmit={onValidateCollectionDraft} noValidate className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-primary" htmlFor="rbg4-managerfinancefinesandpaymentspage-170">{tManagerUi('select_member')}</label>
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                      <input id="rbg4-managerfinancefinesandpaymentspage-170" required type="text" className="mgr-input pl-9" placeholder={tManagerUi('search_by_name_or_lib_id')} 
                        {...registerCollection('member')} aria-invalid={Boolean(collectionErrors.member)} aria-describedby={collectionErrors.member ? 'fine-collection-member-error' : undefined}
                      />
                      {collectionFieldError('member')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-primary" htmlFor="rbg4-managerfinancefinesandpaymentspage-181">{tManagerUi('select_outstanding_fine')}</label>
                      <select id="rbg4-managerfinancefinesandpaymentspage-181" className="mgr-input" {...registerCollection('fineId')} aria-invalid={Boolean(collectionErrors.fineId)} aria-describedby={collectionErrors.fineId ? 'fine-collection-fineId-error' : undefined}>
                        <option value="">{tManagerUi('select_or_enter_custom')}</option>
                        {MANAGER_FINANCE_SAMPLE_PENDING_FINES.map(f => (
                          <option key={f.id} value={f.type}>{f.id} - {translateFineType(f.type)} ({formatCurrency(f.amount)})</option>
                        ))}
                      </select>
                      {collectionFieldError('fineId')}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-primary" htmlFor="rbg4-managerfinancefinesandpaymentspage-191">{tManagerUi('amount_inr')}</label>
                      <input id="rbg4-managerfinancefinesandpaymentspage-191" required type="number" min="1" className="mgr-input" placeholder={tManagerUi('e_g_150')}
                        {...registerCollection('amount')} aria-invalid={Boolean(collectionErrors.amount)} aria-describedby={collectionErrors.amount ? 'fine-collection-amount-error' : undefined}
                      />
                      {collectionFieldError('amount')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-primary" htmlFor="rbg4-managerfinancefinesandpaymentspage-200">{tManagerUi('payment_mode_23b35c')}</label>
                      <select id="rbg4-managerfinancefinesandpaymentspage-200" className="mgr-input" {...registerCollection('mode')} aria-invalid={Boolean(collectionErrors.mode)} aria-describedby={collectionErrors.mode ? 'fine-collection-mode-error' : undefined}>
                        <option value="cash">{tManagerUi('cash')}</option>
                        <option value="upi">{tManagerUi('upi')}</option>
                        <option value="card">{tManagerUi('card')}</option>
                        <option value="bank">{tManagerUi('bank')}</option>
                        <option value="other">{tManagerUi('other')}</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-primary" htmlFor="rbg4-managerfinancefinesandpaymentspage-211">{tManagerUi('transaction_id_optional')}</label>
                      <input id="rbg4-managerfinancefinesandpaymentspage-211" type="text" className="mgr-input" placeholder={tManagerUi('required_for_upi_card_bank')}
                        {...registerCollection('txnId')} aria-invalid={Boolean(collectionErrors.txnId)} aria-describedby={collectionErrors.txnId ? 'fine-collection-txnId-error' : undefined}
                      />
                      {collectionFieldError('txnId')}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled className="mgr-btn-primary px-8 text-primary shadow-card cursor-not-allowed" title={tManagerUi('collection_unavailable_verified_api_contract_not_supplie_cbded7')}>
                      <AlertCircle size={16} className="mr-2 inline" /> {tManagerUi('collection_unavailable')}
                    </button>
                  </div>
              </form>
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

          {/* PAYMENT HISTORY & RECEIPTS (AG GRID) */}
          {(activeTab === 'history' || activeTab === 'paid' || activeTab === 'receipts') && (
            <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
              <h2 className="text-xl font-bold text-primary mb-6 border-b border-border pb-4">{tManagerUi(TABS.find((tab) => tab.id === activeTab)?.labelKey ?? 'fines_dashboard_tab')}</h2>
              <div className="flex-1 w-full h-96">
                <ManagerFinanceFinesPaymentsNativeTable getRowKey={(row) => String(row.id)} emptyMessage={tManagerUi('no_receipts_found')} rows={MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY} columns={historyCols} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
