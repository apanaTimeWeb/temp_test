'use client';

import { useTranslations } from 'next-intl';
import {
  MANAGER_FINANCE_SAMPLE_PENDING_FINES,
  MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY,
} from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsDemoRepository';
import { useManagerFinesPaymentsFormatting } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsFormattingHook';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MANAGER_FINANCE_FINES_PAYMENTS_ROUTES } from '@/app/frontend_manager/manager_finance/finance_fines_payments/config/manager_finance_fines_payments.url_config';
import {
  AlertCircle,
  DollarSign,
  CheckCircle,
  RotateCcw,
  Receipt,
} from 'lucide-react';
import type { ManagerFinanceFinesPaymentsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsComponentTypes';
import { toast } from 'sonner';
import ManagerFinanceFinesPaymentsHeaderBanner from './ManagerFinanceFinesPaymentsHeaderBanner';
import ManagerFinanceFinesPaymentsTimeHorizonBar, { type ManagerFinanceTimeHorizon } from './ManagerFinanceFinesPaymentsTimeHorizonBar';
import ManagerFinanceFinesPaymentsDashboardTab from './ManagerFinanceFinesPaymentsDashboardTab';
import ManagerFinanceFinesPaymentsTablesSection from './ManagerFinanceFinesPaymentsTablesSection';
import ManagerFinanceFinesPaymentsReceiptModal from './ManagerFinanceFinesPaymentsReceiptModal';
import {
  buildPendingCols,
  buildHistoryCols,
  buildReceiptsCols,
} from './ManagerFinanceFinesPaymentsTableColumns';
import { useManagerFinanceFinesPaymentsPageData } from '../../hooks/useManagerFinanceFinesPaymentsPageData';

export type { ManagerFinanceTimeHorizon };

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

const TABS = [
  { id: 'dashboard', labelKey: 'fines_dashboard_tab', icon: DollarSign },
  { id: 'pending', labelKey: 'pending_fines_tab', icon: AlertCircle },
  { id: 'paid', labelKey: 'paid_fines_tab', icon: CheckCircle },
  { id: 'partiallyPaid', labelKey: 'partially_paid_tab', icon: RotateCcw },
  { id: 'receipts', labelKey: 'receipts_tab', icon: Receipt },
  { id: 'refundRequests', labelKey: 'refund_requests_tab', icon: RotateCcw },
] as const;

export default function ManagerFinanceFinesPaymentsFinesAndPaymentsPage(_routeQuery: ManagerFinanceFinesPaymentsRouteQueryProps) {
  const router = useRouter();
  const tManagerUi = useTranslations('manager.manager_fines_payments.ui');
  const { formatCurrency } = useManagerFinesPaymentsFormatting();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReceipt, setSelectedReceipt] = useState<ManagerReceiptRecord | null>(null);
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [receiptModeFilter, setReceiptModeFilter] = useState('all');
  const [fineTypeFilter, setFineTypeFilter] = useState('all');
  const [historyModeFilter, setHistoryModeFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    timeHorizon,
    setTimeHorizon,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    timeHorizonLabel,
    receiptRows,
    filteredPendingFines,
    filteredHistoryRows,
    filteredReceiptRows,
    dashboardKpis,
    handleExportReceiptsCsv,
    handleExportPendingFinesCsv,
    handleExportHistoryCsv,
    handleShareWhatsApp,
    handleShareEmail,
    handleShareSms,
    translateFineType,
    translatePaymentMode,
  } = useManagerFinanceFinesPaymentsPageData({
    formatCurrency,
    activeTab,
    tableSearchQuery,
    fineTypeFilter,
    historyModeFilter,
    receiptModeFilter,
    tManagerUi,
  });

  const handleSyncLedger = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Financial ledger synchronized successfully');
    }, 600);
  };

  const pendingCols = useMemo(() => buildPendingCols(formatCurrency, translateFineType, tManagerUi), [formatCurrency, translateFineType, tManagerUi]);
  const historyCols = useMemo(() => buildHistoryCols(formatCurrency, translateFineType, translatePaymentMode, tManagerUi), [formatCurrency, translateFineType, translatePaymentMode, tManagerUi]);
  const receiptsCols = useMemo(() => buildReceiptsCols({
    formatCurrency,
    translatePaymentMode,
    tManagerUi,
    onSelectReceipt: setSelectedReceipt,
    onPrintReceipt: (_r) => window.print(),
    onShareWhatsApp: handleShareWhatsApp,
    onShareEmail: handleShareEmail,
    onShareSms: handleShareSms,
  }), [formatCurrency, translatePaymentMode, tManagerUi, handleShareWhatsApp, handleShareEmail, handleShareSms]);

  const handleResetFilters = () => {
    setTableSearchQuery('');
    setFineTypeFilter('all');
    setHistoryModeFilter('all');
    setReceiptModeFilter('all');
    setTimeHorizon('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  return (
    <div
      className="mgr-page-animate relative pb-12 space-y-6"
      data-testid="manager-finance-fines-and-payments-page"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
    >
      <ManagerFinanceFinesPaymentsHeaderBanner
        receiptsCount={filteredReceiptRows.length}
        timeHorizonLabel={timeHorizonLabel}
        isSyncing={isSyncing}
        onSyncLedger={handleSyncLedger}
        onViewReceipts={() => setActiveTab('receipts')}
        financeLabel={tManagerUi('finance')}
        finesPaymentsTitle={tManagerUi('fines_payments')}
        scopeDescription={tManagerUi('manage_fine_collections_view_pending_dues_and_request_re_7b6cc6')}
        warningNotice={tManagerUi('this_page_displays_sample_financial_records_for_layout_r_04f8ef')}
      />

      <ManagerFinanceFinesPaymentsTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
      />

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count =
            tab.id === 'pending'
              ? MANAGER_FINANCE_SAMPLE_PENDING_FINES.filter((f) => f.status === 'Pending').length
              : tab.id === 'partiallyPaid'
              ? MANAGER_FINANCE_SAMPLE_PENDING_FINES.filter((f) => f.status === 'Partially Paid').length
              : tab.id === 'paid'
              ? MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY.length
              : tab.id === 'receipts'
              ? receiptRows.length
              : null;

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
                handleResetFilters();
              }}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary'
                  : 'bg-card border border-border text-secondary hover:text-primary hover:bg-surface-hover'
              }`}
            >
              <tab.icon size={15} className={isActive ? 'text-on-primary' : 'text-secondary'} />
              <span>{tManagerUi(tab.labelKey)}</span>
              {count !== null && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-black text-primary' : 'bg-muted text-secondary'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mgr-card p-6 min-h-96 w-full shadow-card border border-border rounded-2xl bg-card">
        {activeTab === 'dashboard' && (
          <ManagerFinanceFinesPaymentsDashboardTab
            overviewTitle={tManagerUi('fine_collection_overview')}
            timeHorizonSubtitle={`Synchronized with ${timeHorizonLabel}`}
            timeHorizonLabel={timeHorizonLabel}
            kpis={dashboardKpis}
            getKpiLabel={(k) => tManagerUi(k)}
            onSelectKpi={(targetTab, filterType) => {
              setActiveTab(targetTab);
              setFineTypeFilter(filterType);
            }}
          />
        )}

        {activeTab !== 'dashboard' && (
          <ManagerFinanceFinesPaymentsTablesSection
            activeTab={activeTab}
            tableSearchQuery={tableSearchQuery}
            onTableSearchQueryChange={setTableSearchQuery}
            fineTypeFilter={fineTypeFilter}
            onFineTypeFilterChange={setFineTypeFilter}
            historyModeFilter={historyModeFilter}
            onHistoryModeFilterChange={setHistoryModeFilter}
            receiptModeFilter={receiptModeFilter}
            onReceiptModeFilterChange={setReceiptModeFilter}
            onResetFilters={handleResetFilters}
            timeHorizon={timeHorizon}
            timeHorizonLabel={timeHorizonLabel}
            filteredPendingFines={filteredPendingFines}
            filteredHistoryRows={filteredHistoryRows}
            filteredReceiptRows={filteredReceiptRows}
            totalReceiptsCount={receiptRows.length}
            pendingCols={pendingCols}
            historyCols={historyCols}
            receiptsCols={receiptsCols}
            onExportPendingFinesCsv={handleExportPendingFinesCsv}
            onExportHistoryCsv={handleExportHistoryCsv}
            onExportReceiptsCsv={handleExportReceiptsCsv}
            tabLabel={tManagerUi(TABS.find((tab) => tab.id === activeTab)?.labelKey ?? 'fines_dashboard_tab')}
            emptySearchMessage={tManagerUi('no_receipts_found')}
            prevPageLabel={tManagerUi('previous_page')}
            nextPageLabel={tManagerUi('next_page')}
          />
        )}
      </div>

      <ManagerFinanceFinesPaymentsReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        formatCurrency={formatCurrency}
        onPrint={(_r) => window.print()}
        onShareWhatsApp={handleShareWhatsApp}
        onShareEmail={handleShareEmail}
        onShareSms={handleShareSms}
      />
    </div>
  );
}
