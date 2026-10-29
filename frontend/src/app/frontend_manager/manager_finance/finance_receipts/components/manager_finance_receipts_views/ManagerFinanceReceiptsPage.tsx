'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { MANAGER_FINANCE_SAMPLE_RECEIPTS } from '@/app/frontend_manager/manager_finance/finance_receipts/hooks/ManagerFinanceReceiptsDemoRepository';
import { useManagerReceiptUrlFilters } from '@/app/frontend_manager/manager_finance/finance_receipts/hooks/useManagerFinanceReceiptsUrlFilters';
import { MANAGER_FINANCE_RECEIPTS_ROUTES } from '@/app/frontend_manager/manager_finance/finance_receipts/config/manager_finance_receipts.url_config';

import { useManagerReceiptFormatting } from '@/app/frontend_manager/manager_finance/finance_receipts/hooks/ManagerFinanceReceiptsFormattingHook';
// RESPONSIBILITY: Entry page for the manager_receipt module.
// DATA FLOW: Next.js Router -> Page -> Components

// RESPONSIBILITY: Entry page for the manager_receipt module.
// DATA FLOW: Next.js Router -> Page -> Components
import Link from 'next/link';
import { Search, Receipt, Eye } from 'lucide-react';
import { ManagerFinanceReceiptsEmptyState } from '@/app/frontend_manager/manager_finance/finance_receipts/components/manager_finance_receipts_empty_states/ManagerFinanceReceiptsEmptyState';
import type { FilterMode, ManagerFinanceReceiptsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_receipts/types/ManagerFinanceReceiptsComponentTypes';
import { MANAGER_FINANCE_RECEIPTS_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_finance/finance_receipts/constants/ManagerFinanceReceiptsConstants';




const URL_FILTERS = {
  search: { defaultValue: '' },
  mode: { defaultValue: 'all', allowedValues: ['all', 'upi', 'cash', 'card', 'bank transfer'] },
} as const;

const MODE_BADGE: Record<string, string> = {
  upi: 'fin-badge fin-badge--upi', cash: 'fin-badge fin-badge--cash',
  card: 'fin-badge fin-badge--card', 'bank transfer': 'fin-badge fin-badge--bank',
};



export default function ManagerFinanceReceiptsPage(_routeQuery: ManagerFinanceReceiptsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_receipt.ui');
  const { formatCurrency, formatDate } = useManagerReceiptFormatting();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerReceiptUrlFilters(URL_FILTERS);
  const search = urlFilters.search;
  const [searchInput, setSearchInput] = useState(search);
  // Dependency rationale: keep the editable search input synchronized when the URL-backed search value changes.
  useEffect(() => { setSearchInput(search); }, [search]);
  // Dependency rationale: debounce search changes before writing them to URL state; clear the timer when inputs change or the component unmounts.
  useEffect(() => {
    if (searchInput === search) return;
    const timeout = window.setTimeout(() => setUrlFilter('search', searchInput), MANAGER_FINANCE_RECEIPTS_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [searchInput, search, setUrlFilter]);
  const modeFilter = urlFilters.mode as FilterMode;

  const filtered = MANAGER_FINANCE_SAMPLE_RECEIPTS.filter(r => {
    const ms = !search || r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase());
    const mm = modeFilter === 'all' || r.paymentMode.toLowerCase() === modeFilter;
    return ms && mm;
  });

  const totalCollected = MANAGER_FINANCE_SAMPLE_RECEIPTS.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div>
        <h1 className="fin-page-title">{tManagerUi('receipts')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('review_sample_receipt_metadata_these_rows_are_not_verifi_da2dc9')}</p>
        <p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-finance-receipt-contract-warning">{tManagerUi('sample_data_only_printing_or_sharing_these_records_as_pr_922a61')}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: tManagerUi('total_receipts'), value: MANAGER_FINANCE_SAMPLE_RECEIPTS.length.toString() },
          { label: tManagerUi('total_collected'), value: formatCurrency(totalCollected), success: true },
          { label: tManagerUi('this_month'), value: MANAGER_FINANCE_SAMPLE_RECEIPTS.filter(r => r.date.startsWith(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)).length.toString() },
        ].map(k => (
          <div key={k.label} className="fin-kpi-card">
            <div className="fin-kpi-card__header"><p className="fin-kpi-label">{k.label}</p><Receipt size={18} className="fin-icon-muted" /></div>
            <p className={`fin-kpi-value${k.success ? ' fin-text-success' : ''}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="fin-filter-bar">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 fin-icon-muted" />
          <input className="fin-input fin-input--pl9" placeholder={tManagerUi('search_by_receipt_no_student_name_or_id')} value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <select className="fin-select w-40" value={modeFilter} onChange={e => setUrlFilter('mode', e.target.value)} aria-label={tManagerUi('all_modes')}>
          <option value="all">{tManagerUi('all_modes')}</option>
          <option value="upi">{tManagerUi('upi')}</option>
          <option value="cash">{tManagerUi('cash')}</option>
          <option value="card">{tManagerUi('card')}</option>
          <option value="bank transfer">{tManagerUi('bank_transfer')}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tManagerUi('receipt_no')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('plan')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('date')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('amount_43dc85')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('mode')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><ManagerFinanceReceiptsEmptyState className="fin-empty-state"><div className="fin-empty-state__icon">🧾</div><p className="fin-empty-state__title">{tManagerUi('no_receipts_found')}</p></ManagerFinanceReceiptsEmptyState></td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className="fin-table-hover-row fin-table-row">
                <td className="py-3 px-4"><span className="fin-mono">{r.receiptNumber}</span></td>
                <td className="py-3 px-4">
                  <p className="fin-cell-name">{r.studentName}</p>
                  <p className="fin-cell-subtext">{r.studentId}</p>
                </td>
                <td className="py-3 px-4 fin-cell-subtext max-w-48">{r.planName}</td>
                <td className="py-3 px-4 fin-cell-subtext">{formatDate(r.date)}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(r.amount)}</td>
                <td className="py-3 px-4">
                  <span className={MODE_BADGE[r.paymentMode.toLowerCase()] || 'fin-badge fin-badge--info'}>{tManagerUi(r.paymentMode.toLowerCase() === 'bank transfer' ? 'bank_transfer' : r.paymentMode.toLowerCase())}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link className="fin-badge fin-badge--neutral cursor-pointer" href={MANAGER_FINANCE_RECEIPTS_ROUTES.RECEIPT_DETAIL(r.id)}><Eye size={11} /> {tManagerUi('view')}</Link>
                    <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tManagerUi('print_unavailable_current_rows_are_sample_receipt_data')}>{tManagerUi('print_unavailable')}</button>
                    <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tManagerUi('share_unavailable_verified_host_messaging_contract_not_s_682f85')}>{tManagerUi('share_unavailable')}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
