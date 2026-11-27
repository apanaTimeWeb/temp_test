'use client';

import ManagerFinanceFinesPaymentsDashboardTab from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsDashboardTab';
import ManagerFinanceFinesPaymentsHeaderBanner from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsHeaderBanner';
import ManagerFinanceFinesPaymentsReceiptModal from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsReceiptModal';
import {
  buildHistoryCols,
  buildPendingCols,
  buildReceiptsCols,
} from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsTableColumns';
import ManagerFinanceFinesPaymentsTablesSection from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsTablesSection';
import ManagerFinanceFinesPaymentsTabsBar from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsTabsBar';
import ManagerFinanceFinesPaymentsTimeHorizonBar, {
  type ManagerFinanceTimeHorizon,
} from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsTimeHorizonBar';
import {
  MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY,
  MANAGER_FINANCE_SAMPLE_PENDING_FINES,
} from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsDemoRepository';
import { useManagerFinesPaymentsFormatting } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsFormattingHook';
import { useManagerFinanceFinesPaymentsPageData } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/useManagerFinanceFinesPaymentsPageData';
import type { ManagerFinanceFinesPaymentsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsComponentTypes';
import { AlertCircle, CheckCircle, DollarSign, Receipt, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

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
] as const;

export default function ManagerFinanceFinesPaymentsFinesAndPaymentsPage(_routeQuery: ManagerFinanceFinesPaymentsRouteQueryProps) {
  useRouter();
  const tManagerUi = useTranslations('manager.manager_fines_payments.ui');
  const { formatCurrency } = useManagerFinesPaymentsFormatting();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReceipt, setSelectedReceipt] = useState<ManagerReceiptRecord | null>(null);
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [receiptModeFilter, setReceiptModeFilter] = useState('all');
  const [fineTypeFilter, setFineTypeFilter] = useState('all');
  const [historyModeFilter, setHistoryModeFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [renewalAddedFines, setRenewalAddedFines] = useState<Set<string>>(new Set());

  const {
    timeHorizon, setTimeHorizon, customStartDate, setCustomStartDate, customEndDate, setCustomEndDate,
    timeHorizonLabel, receiptRows, filteredPendingFines, filteredHistoryRows, filteredReceiptRows,
    dashboardKpis, handleExportReceiptsCsv, handleExportPendingFinesCsv, handleExportHistoryCsv,
    handleShareWhatsApp, handleShareEmail, handleShareSms, translateFineType, translatePaymentMode,
  } = useManagerFinanceFinesPaymentsPageData({
    formatCurrency, activeTab, tableSearchQuery, fineTypeFilter, historyModeFilter, receiptModeFilter, tManagerUi,
  });

  const handleSyncLedger = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Financial ledger synchronized successfully', { id: 'fines-sync-ledger-success' });
    }, 600);
  };

  const handleAddToRenewal = (fine: { id: string; member: string; amount: number }) => {
    setRenewalAddedFines((prev) => new Set(prev).add(fine.id));
    toast.success(`Fine ${fine.id} (${formatCurrency(fine.amount)}) attached! Will be auto-added to next renewal bill for ${fine.member}.`, {
      id: 'fines-add-renewal-success',
    });
  };

  const pendingCols = useMemo(
    () => buildPendingCols(formatCurrency, translateFineType, tManagerUi, handleAddToRenewal, renewalAddedFines),
    [formatCurrency, translateFineType, tManagerUi, renewalAddedFines]
  );
  const historyCols = useMemo(
    () => buildHistoryCols(formatCurrency, translateFineType, translatePaymentMode, tManagerUi),
    [formatCurrency, translateFineType, translatePaymentMode, tManagerUi]
  );
  const receiptsCols = useMemo(
    () =>
      buildReceiptsCols({
        formatCurrency,
        translatePaymentMode,
        tManagerUi,
        onSelectReceipt: setSelectedReceipt,
        onPrintReceipt: () => window.print(),
        onShareWhatsApp: handleShareWhatsApp,
        onShareEmail: handleShareEmail,
        onShareSms: handleShareSms,
      }),
    [formatCurrency, translatePaymentMode, tManagerUi, handleShareWhatsApp, handleShareEmail, handleShareSms]
  );

  const handleResetFilters = () => {
    setTableSearchQuery('');
    setFineTypeFilter('all');
    setHistoryModeFilter('all');
    setReceiptModeFilter('all');
    setTimeHorizon('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const tabsWithCounts = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        count:
          tab.id === 'pending'
            ? MANAGER_FINANCE_SAMPLE_PENDING_FINES.filter((f) => f.status === 'Pending').length
            : tab.id === 'partiallyPaid'
              ? MANAGER_FINANCE_SAMPLE_PENDING_FINES.filter((f) => f.status === 'Partially Paid').length
              : tab.id === 'paid'
                ? MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY.length
                : tab.id === 'receipts'
                  ? receiptRows.length
                  : null,
      })),
    [receiptRows.length]
  );

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
        onExportCsv={handleExportReceiptsCsv}
        onPrint={() => window.print()}
      />

      <ManagerFinanceFinesPaymentsTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
      />

      <ManagerFinanceFinesPaymentsTabsBar
        tabs={tabsWithCounts}
        activeTab={activeTab}
        getTabLabel={(k) => tManagerUi(k)}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          handleResetFilters();
        }}
      />

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
        onPrint={() => window.print()}
        onShareWhatsApp={handleShareWhatsApp}
        onShareEmail={handleShareEmail}
        onShareSms={handleShareSms}
      />
    </div>
  );
}
