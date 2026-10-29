'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { MANAGER_FINANCE_SAMPLE_INVOICES } from '@/app/frontend_manager/manager_finance/finance_invoices/hooks/ManagerFinanceInvoicesDemoRepository';
import { useManagerInvoiceUrlFilters } from '@/app/frontend_manager/manager_finance/finance_invoices/hooks/useManagerFinanceInvoicesUrlFilters';
import { MANAGER_FINANCE_INVOICES_ROUTES } from '@/app/frontend_manager/manager_finance/finance_invoices/config/manager_finance_invoices.url_config';

import { useManagerInvoiceFormatting } from '@/app/frontend_manager/manager_finance/finance_invoices/hooks/ManagerFinanceInvoicesFormattingHook';
// RESPONSIBILITY: Entry page for the manager_invoice module.
// DATA FLOW: Next.js Router -> Page -> Components

// RESPONSIBILITY: Entry page for the manager_invoice module.
// DATA FLOW: Next.js Router -> Page -> Components
import Link from 'next/link';
import { Search, FileText, Eye } from 'lucide-react';
import { ManagerFinanceInvoicesEmptyState } from '@/app/frontend_manager/manager_finance/finance_invoices/components/manager_finance_invoices_empty_states/ManagerFinanceInvoicesEmptyState';
import type { FilterStatus, ManagerFinanceInvoicesRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_invoices/types/ManagerFinanceInvoicesComponentTypes';
import { MANAGER_FINANCE_INVOICES_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_finance/finance_invoices/constants/ManagerFinanceInvoicesConstants';

const URL_FILTERS = {
  search: { defaultValue: '' },
  status: { defaultValue: 'all', allowedValues: ['all', 'paid', 'pending', 'overdue'] },
} as const;

const STATUS_BADGE: Record<string, string> = {
  paid: 'fin-badge fin-badge--success', pending: 'fin-badge fin-badge--warning', overdue: 'fin-badge fin-badge--danger',
};

export default function ManagerFinanceInvoicesPage(_routeQuery: ManagerFinanceInvoicesRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_invoice.ui');
  const { formatCurrency, formatDate } = useManagerInvoiceFormatting();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerInvoiceUrlFilters(URL_FILTERS);
  const search = urlFilters.search;
  const [searchInput, setSearchInput] = useState(search);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Dependency rationale: keep the editable search input synchronized when the URL-backed search value changes.
  useEffect(() => { setSearchInput(search); }, [search]);
  // Dependency rationale: debounce search changes (300ms) before writing them to URL state; clear the timer when inputs change or the component unmounts.
  useEffect(() => {
    if (searchInput === search) return;
    const timeout = setTimeout(() => {
      setUrlFilter('search', searchInput);
      setPage(0);
    }, MANAGER_FINANCE_INVOICES_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput, search, setUrlFilter]);
  const statusFilter = urlFilters.status as FilterStatus;

  const filtered = MANAGER_FINANCE_SAMPLE_INVOICES.filter(inv => {
    const ms = !search || inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.studentId.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return ms && mst;
  });

  const totalRows = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = filtered.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  return (
    <div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div>
        <h1 className="fin-page-title">{tManagerUi('invoices')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('review_sample_invoice_metadata_these_rows_are_not_verifi_1828f9')}</p>
        <p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-finance-invoice-contract-warning">{tManagerUi('sample_data_only_printing_or_sharing_these_records_as_of_0ead95')}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: tManagerUi('total_invoices'), value: MANAGER_FINANCE_SAMPLE_INVOICES.length.toString() },
          { label: tManagerUi('total_billed'), value: formatCurrency(MANAGER_FINANCE_SAMPLE_INVOICES.reduce((s, i) => s + i.grandTotal, 0)), success: true },
          { label: tManagerUi('pending_overdue'), value: MANAGER_FINANCE_SAMPLE_INVOICES.filter(i => i.paymentStatus !== 'paid').length.toString(), warning: true },
        ].map(k => (
          <div key={k.label} className={`fin-kpi-card${k.warning ? ' fin-kpi-card--warning' : ''}`}>
            <div className="fin-kpi-card__header"><p className={`fin-kpi-label${k.warning ? ' fin-kpi-label--warning' : ''}`}>{k.label}</p><FileText size={18} className={k.warning ? 'fin-text-warning' : 'fin-icon-muted'} /></div>
            <p className={`fin-kpi-value${k.success ? ' fin-text-success' : k.warning ? ' fin-kpi-value--warning' : ''}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="fin-filter-bar">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 fin-icon-muted" />
          <input className="fin-input fin-input--pl9" placeholder={tManagerUi('search_by_invoice_no_student_name_or_id')} value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <select className="fin-select w-40" value={statusFilter} onChange={e => { setUrlFilter('status', e.target.value); setPage(0); }} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="paid">{tManagerUi('paid')}</option>
          <option value="pending">{tManagerUi('pending_96f608')}</option>
          <option value="overdue">{tManagerUi('overdue')}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
              <th className="text-left py-3 px-4">{tManagerUi('invoice_no')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('date')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('amount_43dc85')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('mode')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><ManagerFinanceInvoicesEmptyState className="fin-empty-state"><div className="fin-empty-state__icon">🧾</div><p className="fin-empty-state__title">{tManagerUi('no_invoices_found')}</p></ManagerFinanceInvoicesEmptyState></td></tr>
            ) : paginated.map(inv => (
              <tr key={inv.id} className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12">
                <td className="py-3 px-4"><span className="fin-mono">{inv.invoiceNumber}</span></td>
                <td className="py-3 px-4">
                  <p className="fin-cell-name">{inv.studentName}</p>
                  <p className="fin-cell-subtext">{inv.studentId}</p>
                </td>
                <td className="py-3 px-4 fin-cell-subtext">{formatDate(inv.invoiceDate)}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(inv.grandTotal)}</td>
                <td className="py-3 px-4">
                  {inv.paymentMode
                    ? <span className={`fin-badge fin-badge--${inv.paymentMode.toLowerCase().replace(' ', '-')}`}>{inv.paymentMode}</span>
                    : <span className="fin-text-muted">—</span>}
                </td>
                <td className="py-3 px-4">
                  <span className={STATUS_BADGE[inv.paymentStatus] || 'fin-badge fin-badge--neutral'}>{tManagerUi(inv.paymentStatus)}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link className="fin-badge fin-badge--neutral cursor-pointer" href={MANAGER_FINANCE_INVOICES_ROUTES.INVOICE_DETAIL(inv.id)}><Eye size={11} /> {tManagerUi('view')}</Link>
                    <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tManagerUi('print_unavailable_current_rows_are_sample_invoice_data')}>{tManagerUi('print_unavailable')}</button>
                    <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tManagerUi('share_unavailable_verified_host_messaging_contract_not_s_682f85')}>{tManagerUi('share_unavailable')}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
            <span>
              Showing {startItem}–{endItem} of {totalRows} results
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <label htmlFor="rows-per-page-finance-invoices" className="text-xs text-secondary whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="rows-per-page-finance-invoices"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="mgr-btn-ghost mgr-btn-sm"
                  disabled={effectivePage <= 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                >
                  Previous
                </button>
                <span className="text-xs text-secondary px-1">
                  Page {effectivePage + 1} of {pageCount}
                </span>
                <button
                  type="button"
                  className="mgr-btn-ghost mgr-btn-sm"
                  disabled={effectivePage >= pageCount - 1}
                  onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
