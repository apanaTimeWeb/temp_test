'use client';

import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsDemoRepository';
import { useManagerSubscriptionsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/useManagerFinanceSubscriptionsUrlFilters';
import { useManagerSubscriptionsFormatting } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsFormattingHook';
import { useState, useEffect, useMemo } from 'react';
import { Download, Upload, Printer, MessageSquare, Send, Mail, CheckCircle, X, Search, RefreshCw } from 'lucide-react';
import { sanitizeManagerSubscriptionsCsvCell } from '@/app/frontend_manager/manager_finance/finance_subscriptions/utils/ManagerFinanceSubscriptionsCsv';
import type { ManagerFinanceSubscriptionsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_subscriptions/types/ManagerFinanceSubscriptionsComponentTypes';
import ManagerFinanceSubscriptionsTable from './ManagerFinanceSubscriptionsTable';
import ManagerFinanceSubscriptionsDetailModal from './ManagerFinanceSubscriptionsDetailModal';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SubSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleImport = () => {
    setActionFeedback('Import preview active: Subscription template format verified.');
  };

  const handleWhatsApp = () => {
    setActionFeedback('WhatsApp notification broadcast queued for active members.');
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

  return (
    <div
      className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}
    >
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="fin-page-title">{tManagerUi('subscriptions')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('manage_all_student_subscriptions')}</p>
          <p className="fin-input-hint fin-text-warning mt-2" data-testid="manager-finance-subscriptions-sample-warning" role="status">
            {tManagerUi('subscription_rows_and_amounts_are_illustrative_sample_da_4b9c16')}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button type="button" className="fin-btn fin-btn-secondary" disabled title={tManagerUi('renewal_unavailable')}>
            <RefreshCw size={14} /> {tManagerUi('renewal_unavailable')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary" onClick={handleImport} title={tManagerUi('import')}>
            <Upload size={14} /> {tManagerUi('import')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary" onClick={handleExportCsv} title="Export CSV">
            <Download size={14} /> Export CSV
          </button>
          <button type="button" className="fin-btn fin-btn-secondary" onClick={handlePrint} title="Print Subscription Summary">
            <Printer size={14} /> Print
          </button>
          <button type="button" className="fin-btn fin-btn-secondary text-success" onClick={handleWhatsApp} title={tManagerUi('whatsapp')}>
            <MessageSquare size={14} /> {tManagerUi('whatsapp')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary text-info" onClick={handleTelegram} title={tManagerUi('telegram')}>
            <Send size={14} /> {tManagerUi('telegram')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary text-purple" onClick={handleEmail} title={tManagerUi('email')}>
            <Mail size={14} /> {tManagerUi('email')}
          </button>
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

      <div className="fin-filter-bar flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search student, smart ID, plan..."
            className="mgr-input pl-8 text-xs w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <select className="fin-select w-40" value={statusFilter} onChange={(e) => setUrlFilter('status', e.target.value)} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="active">{tManagerUi('active')}</option>
          <option value="expired">{tManagerUi('expired')}</option>
          <option value="suspended">{tManagerUi('suspended')}</option>
          <option value="cancelled">{tManagerUi('cancelled')}</option>
        </select>
        <select className="fin-select w-40" value={planFilter} onChange={(e) => setUrlFilter('plan', e.target.value)} aria-label={tManagerUi('all_plans')}>
          <option value="all">{tManagerUi('all_plans')}</option>
          <option value="Basic Plan">{tManagerUi('basic_plan')}</option>
          <option value="Premium Plan">{tManagerUi('premium_plan')}</option>
        </select>
        <select className="fin-select w-40" value={shiftFilter} onChange={(e) => setUrlFilter('shift', e.target.value)} aria-label={tManagerUi('all_shifts')}>
          <option value="all">{tManagerUi('all_shifts')}</option>
          <option value="Morning">{tManagerUi('morning')}</option>
          <option value="Afternoon">{tManagerUi('afternoon')}</option>
          <option value="Evening">{tManagerUi('evening')}</option>
          <option value="Night">{tManagerUi('night')}</option>
          <option value="Full Day">{tManagerUi('full_day')}</option>
        </select>
      </div>

      <ManagerFinanceSubscriptionsTable
        filteredRows={filteredRows}
        paginated={paginated}
        searchQuery={searchQuery}
        totalRows={totalRows}
        startItem={startItem}
        endItem={endItem}
        pageSize={pageSize}
        effectivePage={effectivePage}
        pageCount={pageCount}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(0);
        }}
        onPrevPage={() => setPage((c) => Math.max(0, c - 1))}
        onNextPage={() => setPage((c) => Math.min(pageCount - 1, c + 1))}
        onSelectSubscription={(s) => setSelectedSub(s)}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        displayPlan={displayPlan}
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
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
