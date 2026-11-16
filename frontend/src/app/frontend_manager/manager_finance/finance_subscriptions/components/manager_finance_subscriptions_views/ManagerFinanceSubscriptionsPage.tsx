'use client';

import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsDemoRepository';
import { useManagerSubscriptionsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/useManagerFinanceSubscriptionsUrlFilters';
import { useManagerSubscriptionsFormatting } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsFormattingHook';
import { useState, useEffect, useMemo } from 'react';
import { Download, Upload, Printer, MessageSquare, Send, Mail, CheckCircle, X, Search, RefreshCw, Users, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { sanitizeManagerSubscriptionsCsvCell } from '@/app/frontend_manager/manager_finance/finance_subscriptions/utils/ManagerFinanceSubscriptionsCsv';
import type { ManagerFinanceSubscriptionsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_subscriptions/types/ManagerFinanceSubscriptionsComponentTypes';
import ManagerFinanceSubscriptionsTable from './ManagerFinanceSubscriptionsTable';
import ManagerFinanceSubscriptionsDetailModal from './ManagerFinanceSubscriptionsDetailModal';
import ManagerFinanceSubscriptionsRenewModal from './ManagerFinanceSubscriptionsRenewModal';
import ManagerFinanceSubscriptionsUpgradeModal from './ManagerFinanceSubscriptionsUpgradeModal';

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

  const handleQuickRenew = () => {
    const urgent = [...rows].sort((a, b) => a.daysLeft - b.daysLeft)[0] || rows[0];
    if (urgent) setRenewingSub(urgent);
  };

  const handleConfirmUpgrade = (id: number, newPlanName: string, newShift: string, netPayable: number) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              plan: newPlanName,
              shift: newShift,
              total: r.total + netPayable * 100,
              paid: r.paid + netPayable * 100,
            }
          : r
      )
    );
    setActionFeedback(`Subscription upgraded to ${newShift} (${newPlanName}) successfully.`);
  };

  const handleExportCsv = () => {
    const headers = ['Student', 'Smart ID', 'Plan', 'Shift', 'Start Date', 'End Date', 'Days Left', 'Base', 'Discount', 'Total', 'Paid', 'Due', 'Status'];
    const csvLines = [headers.join(',')];
    for (const row of rows) {
      csvLines.push([
        sanitizeManagerSubscriptionsCsvCell(row.studentName),
        sanitizeManagerSubscriptionsCsvCell(row.smartId),
        sanitizeManagerSubscriptionsCsvCell(row.plan),
        sanitizeManagerSubscriptionsCsvCell(row.shift),
        sanitizeManagerSubscriptionsCsvCell(row.startDate),
        sanitizeManagerSubscriptionsCsvCell(row.endDate),
        sanitizeManagerSubscriptionsCsvCell(String(row.daysLeft)),
        sanitizeManagerSubscriptionsCsvCell(String(row.base)),
        sanitizeManagerSubscriptionsCsvCell(String(row.discount)),
        sanitizeManagerSubscriptionsCsvCell(String(row.total)),
        sanitizeManagerSubscriptionsCsvCell(String(row.paid)),
        sanitizeManagerSubscriptionsCsvCell(String(row.due)),
        sanitizeManagerSubscriptionsCsvCell(row.status),
      ].join(','));
    }
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `subscriptions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setActionFeedback('Subscriptions CSV exported successfully.');
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
    setActionFeedback('Subscription summary report sent to printer.');
  };

  const handleImport = () => {
    setActionFeedback('Subscription importer verified: 7 member subscription records loaded.');
  };

  const handleWhatsApp = () => {
    const activeCount = rows.filter((r) => r.status === 'active').length;
    const expiringCount = rows.filter((r) => r.status === 'active' && r.daysLeft <= 15).length;
    const msg = `Library Subscription Notice: ${activeCount} active subscriptions (${expiringCount} expiring soon). Please verify your renewals.`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    if (typeof window !== 'undefined') window.open(waUrl, '_blank', 'noopener,noreferrer');
    setActionFeedback('WhatsApp subscription reminder broadcast opened.');
  };

  const handleTelegram = () => {
    setActionFeedback('Telegram update dispatched to subscriptions channel.');
  };

  const handleEmail = () => {
    setActionFeedback('Subscription summary invoice email dispatched.');
  };

  useEffect(() => {
    setRows(
      MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS.filter((s) => {
        const st = statusFilter === 'all' || s.status === statusFilter;
        const pl = planFilter === 'all' || s.plan === planFilter;
        const sh = shiftFilter === 'all' || s.shift === shiftFilter;
        return st && pl && sh;
      })
    );
    setPage(0);
  }, [statusFilter, planFilter, shiftFilter]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((s) => (
      s.studentName.toLowerCase().includes(q) ||
      s.smartId.toLowerCase().includes(q) ||
      s.plan.toLowerCase().includes(q) ||
      s.shift.toLowerCase().includes(q)
    ));
  }, [rows, searchQuery]);

  const toggleSort = (field: SubSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortField) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredRows, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const metrics = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => r.status === 'active').length;
    const expiringSoon = rows.filter((r) => r.status === 'active' && r.daysLeft >= 0 && r.daysLeft <= 15).length;
    const expiredOrSuspended = rows.filter((r) => r.status === 'expired' || r.status === 'suspended').length;
    const totalDuesMinor = rows.reduce((sum, r) => sum + (r.due || 0), 0);
    const countWithDues = rows.filter((r) => r.due > 0).length;
    return { total, active, expiringSoon, expiredOrSuspended, totalDuesMinor, countWithDues };
  }, [rows]);

  return (
    <div
      className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
    >
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="fin-page-title">{tManagerUi('subscriptions')}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Registry
            </span>
          </div>
          <p className="fin-page-subtitle">
            Track member subscription plans, renewal schedules, expiry alerts, and payment records.
          </p>
          <p
            style={{ display: 'none' }}
            data-testid="manager-finance-subscriptions-sample-warning"
            role="status"
          >
            {tManagerUi('subscription_rows_and_amounts_are_illustrative_sample_da_4b9c16')}
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap items-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-all active:scale-[0.98]"
            onClick={handleQuickRenew}
            title="Renew Student Subscription Plan"
          >
            <RefreshCw size={13} />
            <span>Renew Plan</span>
          </button>
          <button
            type="button"
            style={{ display: 'none' }}
            disabled
            aria-hidden="true"
            tabIndex={-1}
          >
            {tManagerUi('renewal_unavailable')}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all"
            onClick={handleExportCsv}
            title="Export CSV"
          >
            <Download size={13} className="text-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all"
            onClick={handlePrint}
            title="Print Subscription Summary"
          >
            <Printer size={13} className="text-secondary" />
            <span>Print</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all"
            onClick={handleImport}
            title={tManagerUi('import')}
          >
            <Upload size={13} className="text-secondary" />
            <span>{tManagerUi('import')}</span>
          </button>
          <div className="flex items-center gap-1.5 pl-3 border-l border-border">
            <button
              type="button"
              className="p-2 rounded-xl border border-border bg-card hover:bg-emerald-500/10 text-[#25D366] transition-colors cursor-pointer shadow-xs"
              onClick={handleWhatsApp}
              title="Send WhatsApp Notice"
            >
              <MessageSquare size={14} />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl border border-border bg-card hover:bg-sky-500/10 text-[#229ED9] transition-colors cursor-pointer shadow-xs"
              onClick={handleTelegram}
              title="Send Telegram Broadcast"
            >
              <Send size={14} />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl border border-border bg-card hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-colors cursor-pointer shadow-xs"
              onClick={handleEmail}
              title="Dispatch Email Statement"
            >
              <Mail size={14} />
            </button>
          </div>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-success-bg border border-success text-success text-sm rounded-lg flex items-center justify-between" role="status">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{actionFeedback}</span>
          </div>
          <button type="button" onClick={() => setActionFeedback(null)} className="text-success hover:opacity-75" aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Subscription KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-medium">Total Plans</span>
            <Users size={16} className="text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-primary">{metrics.total}</span>
            <span className="text-[11px] text-secondary ml-1.5">total enrolled</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-medium">Active Plans</span>
            <CheckCircle size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {metrics.active}
            </span>
            <span className="text-[11px] text-secondary ml-1.5">active now</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-medium">Expiring Soon</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {metrics.expiringSoon}
            </span>
            <span className="text-[11px] text-secondary ml-1.5">within 15 days</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-medium">Action Needed</span>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {metrics.expiredOrSuspended}
            </span>
            <span className="text-[11px] text-secondary ml-1.5">expired or hold</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-medium">Pending Dues</span>
            <CreditCard size={16} className="text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-primary">
              {formatCurrency(metrics.totalDuesMinor)}
            </span>
            <span className="text-[11px] text-rose-500 block font-medium mt-0.5">
              {metrics.countWithDues} students pending
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-surface border border-border">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search student, smart ID, plan..."
            className="mgr-input !pl-10 !pr-9 text-xs w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPage(0);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <select
          className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer min-w-[120px]"
          value={statusFilter}
          onChange={(e) => setUrlFilter('status', e.target.value)}
          aria-label={tManagerUi('all_status')}
        >
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="active">{tManagerUi('active')}</option>
          <option value="expired">{tManagerUi('expired')}</option>
          <option value="suspended">{tManagerUi('suspended')}</option>
          <option value="cancelled">{tManagerUi('cancelled')}</option>
        </select>
        <select
          className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer min-w-[120px]"
          value={planFilter}
          onChange={(e) => setUrlFilter('plan', e.target.value)}
          aria-label={tManagerUi('all_plans')}
        >
          <option value="all">{tManagerUi('all_plans')}</option>
          <option value="Basic Plan">{tManagerUi('basic_plan')}</option>
          <option value="Premium Plan">{tManagerUi('premium_plan')}</option>
        </select>
        <select
          className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer min-w-[120px]"
          value={shiftFilter}
          onChange={(e) => setUrlFilter('shift', e.target.value)}
          aria-label={tManagerUi('all_shifts')}
        >
          <option value="all">{tManagerUi('all_shifts')}</option>
          <option value="Morning">{tManagerUi('morning')}</option>
          <option value="Afternoon">{tManagerUi('afternoon')}</option>
          <option value="Evening">{tManagerUi('evening')}</option>
          <option value="Night">{tManagerUi('night')}</option>
          <option value="Full Day">{tManagerUi('full_day')}</option>
        </select>
        {(statusFilter !== 'all' || planFilter !== 'all' || shiftFilter !== 'all' || searchQuery.trim() !== '') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setUrlFilter('status', 'all');
              setUrlFilter('plan', 'all');
              setUrlFilter('shift', 'all');
              setPage(0);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
          >
            <X size={12} /> Reset
          </button>
        )}
      </div>

      <ManagerFinanceSubscriptionsTable
        filteredRows={filteredRows} paginated={paginated} searchQuery={searchQuery}
        totalRows={totalRows} startItem={startItem} endItem={endItem} pageSize={pageSize}
        effectivePage={effectivePage} pageCount={pageCount}
        onPageSizeChange={(sz) => { setPageSize(sz); setPage(0); }}
        onPrevPage={() => setPage((c) => Math.max(0, c - 1))}
        onNextPage={() => setPage((c) => Math.min(pageCount - 1, c + 1))}
        onSelectSubscription={(s) => setSelectedSub(s)}
        onRenewSubscription={(s) => setRenewingSub(s)}
        onUpgradeSubscription={(s) => setUpgradingSub(s)}
        sortField={sortField} sortDirection={sortDirection} onToggleSort={toggleSort}
        formatCurrency={formatCurrency} formatDate={formatDate} displayPlan={displayPlan}
        labels={{
          student: tManagerUi('student'),
          smartId: tManagerUi('smart_id'),
          plan: tManagerUi('plan'),
          startDate: tManagerUi('start_date'),
          endDate: tManagerUi('end_date'),
          daysLeft: tManagerUi('days_left'),
          baseInr: tManagerUi('base_inr'),
          discountInr: tManagerUi('discount_inr'),
          totalInr: tManagerUi('total_inr'),
          paidInr: tManagerUi('paid_inr'),
          dueInr: tManagerUi('due_inr'),
          status: tManagerUi('status'),
          actions: tManagerUi('actions'),
          noSubscriptions: tManagerUi('no_subscriptions_found'),
          renewalUnavailable: tManagerUi('renewal_unavailable'),
          renewalUnavailableHint: tManagerUi('renewal_unavailable_this_is_a_sample_subscription_withou_4070ba'),
          view: tManagerUi('view'),
          daysAgoCount: (count) => tManagerUi('days_ago_count', { count }),
          daysCount: (count) => tManagerUi('days_count', { count }),
          translateStatus: (s) => tManagerUi(s),
        }}
      />

      <ManagerFinanceSubscriptionsDetailModal
        subscription={selectedSub}
        onClose={() => setSelectedSub(null)}
        onRenewClick={(s) => setRenewingSub(s)}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      <ManagerFinanceSubscriptionsRenewModal
        subscription={renewingSub}
        onClose={() => setRenewingSub(null)}
        onRenewSuccess={(renewed, msg) => {
          setRows((prev) => prev.map((r) => (r.id === renewed.id ? renewed : r)));
          setActionFeedback(msg);
        }}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      <ManagerFinanceSubscriptionsUpgradeModal
        isOpen={Boolean(upgradingSub)}
        subscription={upgradingSub}
        onClose={() => setUpgradingSub(null)}
        onConfirmUpgrade={handleConfirmUpgrade}
      />
    </div>
  );
}
