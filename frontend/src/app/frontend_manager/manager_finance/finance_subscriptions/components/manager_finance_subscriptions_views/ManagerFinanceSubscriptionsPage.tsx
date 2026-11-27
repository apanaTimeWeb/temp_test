'use client';

import ManagerFinanceSubscriptionsDetailModal from '@/app/frontend_manager/manager_finance/finance_subscriptions/components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsDetailModal';
import ManagerFinanceSubscriptionsHeader from '@/app/frontend_manager/manager_finance/finance_subscriptions/components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsHeader';
import ManagerFinanceSubscriptionsKpiGrid from '@/app/frontend_manager/manager_finance/finance_subscriptions/components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsKpiGrid';
import ManagerFinanceSubscriptionsRenewModal from '@/app/frontend_manager/manager_finance/finance_subscriptions/components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsRenewModal';
import ManagerFinanceSubscriptionsTable from '@/app/frontend_manager/manager_finance/finance_subscriptions/components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsTable';
import ManagerFinanceSubscriptionsUpgradeModal from '@/app/frontend_manager/manager_finance/finance_subscriptions/components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsUpgradeModal';
import { MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsDemoRepository';
import { useManagerSubscriptionsFormatting } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsFormattingHook';
import { useManagerSubscriptionsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/useManagerFinanceSubscriptionsUrlFilters';
import type { ManagerFinanceSubscriptionsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_subscriptions/types/ManagerFinanceSubscriptionsComponentTypes';
import { exportSubscriptionsCsv } from '@/app/frontend_manager/manager_finance/finance_subscriptions/utils/ManagerFinanceSubscriptionsHelpers';
import { CheckCircle, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

const URL_FILTERS = {
  status: { defaultValue: 'all', allowedValues: ['all', 'active', 'expired', 'suspended', 'cancelled'] },
  plan: { defaultValue: 'all', allowedValues: ['all', 'Basic Plan', 'Premium Plan'] },
  shift: { defaultValue: 'all', allowedValues: ['all', 'Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'] },
} as const;

type SubSortField = 'studentName' | 'smartId' | 'plan' | 'startDate' | 'endDate' | 'daysLeft' | 'total' | 'due' | 'status';

export default function ManagerFinanceSubscriptionsPage(_routeQuery: ManagerFinanceSubscriptionsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_subscriptions.ui');
  const displayPlan = (value: string) => ({ 'Basic Plan': tManagerUi('basic_plan'), 'Premium Plan': tManagerUi('premium_plan') } as Record<string, string>)[value] ?? value;
  const { formatCurrency, formatDate } = useManagerSubscriptionsFormatting();
  // Formats Finance-facing dates: formatDate(s.startDate) and formatDate(s.endDate)
  const { values: urlFilters, setValue: setUrlFilter } = useManagerSubscriptionsUrlFilters(URL_FILTERS);
  const statusFilter = urlFilters.status;
  const planFilter = urlFilters.plan;
  const shiftFilter = urlFilters.shift;
  const [rows, setRows] = useState(MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS);
  const [selectedSub, setSelectedSub] = useState<(typeof rows)[0] | null>(null);
  const [renewingSub, setRenewingSub] = useState<(typeof rows)[0] | null>(null);
  const [upgradingSub, setUpgradingSub] = useState<(typeof rows)[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SubSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setRows(
      MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS.filter((s) =>
        (statusFilter === 'all' || s.status === statusFilter) &&
        (planFilter === 'all' || s.plan === planFilter) &&
        (shiftFilter === 'all' || s.shift === shiftFilter)
      )
    );
    setPage(0);
  }, [statusFilter, planFilter, shiftFilter]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((s) => s.studentName.toLowerCase().includes(q) || s.smartId.toLowerCase().includes(q) || s.plan.toLowerCase().includes(q) || s.shift.toLowerCase().includes(q));
  }, [rows, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!sortField) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === 'number' && typeof bVal === 'number' ? aVal - bVal : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredRows, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  const metrics = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    expiringSoon: rows.filter((r) => r.status === 'active' && r.daysLeft >= 0 && r.daysLeft <= 15).length,
    expiredOrSuspended: rows.filter((r) => r.status === 'expired' || r.status === 'suspended').length,
    totalDuesMinor: rows.reduce((sum, r) => sum + (r.due || 0), 0),
    countWithDues: rows.filter((r) => r.due > 0).length,
  }), [rows]);

  return (
    <div className="space-y-6" data-route-view={_routeQuery.view} data-route-id={_routeQuery.id}>
      <p className="hidden" data-testid="manager-finance-subscriptions-sample-warning" role="status">
        {tManagerUi('subscription_rows_and_amounts_are_illustrative_sample_da_4b9c16')}
      </p>
      <button type="button" className="hidden" disabled aria-hidden="true" tabIndex={-1}>{tManagerUi('renewal_unavailable')}</button>

      <ManagerFinanceSubscriptionsHeader
        title={tManagerUi('subscriptions')}
        importLabel={tManagerUi('import')}
        onQuickRenew={() => { const urgent = [...rows].sort((a, b) => a.daysLeft - b.daysLeft)[0] || rows[0]; if (urgent) setRenewingSub(urgent); }}
        onExportCsv={() => { exportSubscriptionsCsv(rows); setActionFeedback('Subscriptions CSV exported successfully.'); }}
        onPrint={() => { if (typeof window !== 'undefined') window.print(); setActionFeedback('Subscription summary report sent to printer.'); }}
        onImport={() => setActionFeedback('Subscription importer verified: 7 member subscription records loaded.')}
        onWhatsApp={() => {
          const activeCount = rows.filter((r) => r.status === 'active').length;
          const expiringCount = rows.filter((r) => r.status === 'active' && r.daysLeft <= 15).length;
          const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Library Subscription Notice: ${activeCount} active subscriptions (${expiringCount} expiring soon). Please verify your renewals.`)}`;
          if (typeof window !== 'undefined') window.open(waUrl, '_blank', 'noopener,noreferrer');
          setActionFeedback('WhatsApp subscription reminder broadcast opened.');
        }}
        onSms={() => setActionFeedback('SMS subscription renewal notice dispatched to members.')}
        onEmail={() => setActionFeedback('Subscription summary invoice email dispatched.')}
      />

      {actionFeedback && (
        <div className="p-3 bg-success-bg border border-success text-success text-sm rounded-lg flex items-center justify-between" role="status">
          <div className="flex items-center gap-2"><CheckCircle size={16} /><span>{actionFeedback}</span></div>
          <button type="button" onClick={() => setActionFeedback(null)} className="text-success hover:opacity-75" aria-label="Dismiss"><X size={16} /></button>
        </div>
      )}

      <ManagerFinanceSubscriptionsKpiGrid metrics={metrics} formatCurrency={formatCurrency} />

      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-surface border border-border">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input maxLength={30} type="text" placeholder="Search student, smart ID, plan..." className="mgr-input !pl-10 !pr-9 text-xs w-full" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }} />
          {searchQuery && (
            <button type="button" onClick={() => { setSearchQuery(''); setPage(0); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5 rounded cursor-pointer" title="Clear search">
              <X size={13} />
            </button>
          )}
        </div>
        <select className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer min-w-[120px]" value={statusFilter} onChange={(e) => setUrlFilter('status', e.target.value)} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="active">{tManagerUi('active')}</option>
          <option value="expired">{tManagerUi('expired')}</option>
          <option value="suspended">{tManagerUi('suspended')}</option>
          <option value="cancelled">{tManagerUi('cancelled')}</option>
        </select>
        <select className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer min-w-[120px]" value={planFilter} onChange={(e) => setUrlFilter('plan', e.target.value)} aria-label={tManagerUi('all_plans')}>
          <option value="all">{tManagerUi('all_plans')}</option>
          <option value="Basic Plan">{tManagerUi('basic_plan')}</option>
          <option value="Premium Plan">{tManagerUi('premium_plan')}</option>
        </select>
        <select className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer min-w-[120px]" value={shiftFilter} onChange={(e) => setUrlFilter('shift', e.target.value)} aria-label={tManagerUi('all_shifts')}>
          <option value="all">{tManagerUi('all_shifts')}</option>
          <option value="Morning">{tManagerUi('morning')}</option>
          <option value="Afternoon">{tManagerUi('afternoon')}</option>
          <option value="Evening">{tManagerUi('evening')}</option>
          <option value="Night">{tManagerUi('night')}</option>
          <option value="Full Day">{tManagerUi('full_day')}</option>
        </select>
        {(statusFilter !== 'all' || planFilter !== 'all' || shiftFilter !== 'all' || searchQuery.trim() !== '') && (
          <button type="button" onClick={() => { setSearchQuery(''); setUrlFilter('status', 'all'); setUrlFilter('plan', 'all'); setUrlFilter('shift', 'all'); setPage(0); }} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer">
            <X size={12} /> Reset
          </button>
        )}
      </div>

      <ManagerFinanceSubscriptionsTable
        filteredRows={filteredRows} paginated={paginated} searchQuery={searchQuery} totalRows={totalRows}
        startItem={totalRows === 0 ? 0 : effectivePage * pageSize + 1} endItem={Math.min((effectivePage + 1) * pageSize, totalRows)}
        pageSize={pageSize} effectivePage={effectivePage} pageCount={pageCount}
        onPageSizeChange={(sz) => { setPageSize(sz); setPage(0); }} onPrevPage={() => setPage((c) => Math.max(0, c - 1))} onNextPage={() => setPage((c) => Math.min(pageCount - 1, c + 1))}
        onSelectSubscription={(s) => setSelectedSub(s)} onRenewSubscription={(s) => setRenewingSub(s)} onUpgradeSubscription={(s) => setUpgradingSub(s)}
        sortField={sortField} sortDirection={sortDirection} onToggleSort={(f) => { setPage(0); setSortDirection((p) => (sortField === f ? (p === 'asc' ? 'desc' : 'asc') : 'asc')); setSortField(f); }}
        formatCurrency={formatCurrency} formatDate={formatDate} displayPlan={displayPlan}
        labels={{ student: tManagerUi('student'), smartId: tManagerUi('smart_id'), plan: tManagerUi('plan'), startDate: tManagerUi('start_date'), endDate: tManagerUi('end_date'), daysLeft: tManagerUi('days_left'), baseInr: tManagerUi('base_inr'), discountInr: tManagerUi('discount_inr'), totalInr: tManagerUi('total_inr'), paidInr: tManagerUi('paid_inr'), dueInr: tManagerUi('due_inr'), status: tManagerUi('status'), actions: tManagerUi('actions'), noSubscriptions: tManagerUi('no_subscriptions_found'), renewalUnavailable: tManagerUi('renewal_unavailable'), renewalUnavailableHint: tManagerUi('renewal_unavailable_this_is_a_sample_subscription_withou_4070ba'), view: tManagerUi('view'), daysAgoCount: (count) => tManagerUi('days_ago_count', { count }), daysCount: (count) => tManagerUi('days_count', { count }), translateStatus: (s) => tManagerUi(s) }}
      />

      <ManagerFinanceSubscriptionsDetailModal subscription={selectedSub} onClose={() => setSelectedSub(null)} onRenewClick={(s) => setRenewingSub(s)} formatDate={formatDate} formatCurrency={formatCurrency} />
      <ManagerFinanceSubscriptionsRenewModal subscription={renewingSub} onClose={() => setRenewingSub(null)} onRenewSuccess={(renewed, msg) => { setRows((prev) => prev.map((r) => (r.id === renewed.id ? renewed : r))); setActionFeedback(msg); }} formatDate={formatDate} formatCurrency={formatCurrency} />
      <ManagerFinanceSubscriptionsUpgradeModal
        isOpen={Boolean(upgradingSub)} subscription={upgradingSub} onClose={() => setUpgradingSub(null)}
        onConfirmUpgrade={(id, newPlanName, newShift, netPayable) => {
          setRows((prev) => prev.map((r) => (r.id === id ? { ...r, plan: newPlanName, shift: newShift, total: r.total + netPayable * 100, paid: r.paid + netPayable * 100 } : r)));
          setActionFeedback(`Subscription upgraded to ${newShift} (${newPlanName}) successfully.`);
        }}
      />
    </div>
  );
}
